import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateManualStatement } from "@/lib/transactions/manual-statement";

const patchSchema = z.object({
  transactionId: z.string().uuid(),
  category: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  is_income: z.boolean().optional(),
});

const createSchema = z.object({
  accountId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  is_income: z.boolean(),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = patchSchema.parse(await request.json());
  const { transactionId, ...updates } = body;

  const payload: Record<string, unknown> = { ...updates };
  if (updates.amount !== undefined) {
    payload.amount = Math.abs(updates.amount);
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(payload)
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transaction: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = createSchema.parse(await request.json());

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id, currency")
    .eq("id", body.accountId)
    .eq("user_id", user.id)
    .single();

  if (accountError || !account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const statementId = await getOrCreateManualStatement(supabase, user.id, body.accountId);

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      account_id: body.accountId,
      statement_id: statementId,
      date: body.date,
      description: body.description,
      amount: Math.abs(body.amount),
      currency: account.currency,
      category: body.category,
      is_income: body.is_income,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transaction: data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const transactionId =
    searchParams.get("id") ?? (await request.json().catch(() => ({}))).transactionId;

  if (!transactionId || typeof transactionId !== "string") {
    return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
