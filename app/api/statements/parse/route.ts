import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseStatement } from "@/lib/parsers";

export const maxDuration = 60;

const parseSchema = z.object({
  statementId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { statementId } = parseSchema.parse(await request.json());

    const { data: statement, error: fetchError } = await supabase
      .from("statements")
      .select("*, accounts(currency)")
      .eq("id", statementId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !statement) {
      return NextResponse.json({ error: "Statement not found" }, { status: 404 });
    }

    if (statement.status === "complete") {
      return NextResponse.json({ status: "complete", transactionCount: 0 });
    }

    await supabase
      .from("statements")
      .update({ status: "processing" })
      .eq("id", statementId);

    const admin = createAdminClient();
    const { data: fileData, error: downloadError } = await admin.storage
      .from("statements")
      .download(statement.file_path);

    if (downloadError || !fileData) {
      await supabase
        .from("statements")
        .update({ status: "failed", error_message: "Could not download file" })
        .eq("id", statementId);
      return NextResponse.json({ error: "Could not download file" }, { status: 500 });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const currency =
      (statement.accounts as { currency: string } | null)?.currency ?? "USD";

    const { transactions, periodStart, periodEnd } = await parseStatement(
      buffer,
      statement.file_type as "csv" | "pdf"
    );

    const rows = transactions.map((t) => ({
      user_id: user.id,
      account_id: statement.account_id,
      statement_id: statementId,
      date: t.date,
      description: t.description,
      amount: t.amount,
      currency,
      category: t.category ?? (t.is_income ? "income" : "other"),
      is_income: t.is_income,
    }));

    await supabase.from("transactions").delete().eq("statement_id", statementId);

    const { error: insertError } = await supabase.from("transactions").insert(rows);

    if (insertError) throw insertError;

    await supabase
      .from("statements")
      .update({
        status: "complete",
        parsed_at: new Date().toISOString(),
        period_start: periodStart ?? null,
        period_end: periodEnd ?? null,
        error_message: null,
      })
      .eq("id", statementId);

    return NextResponse.json({
      status: "complete",
      transactionCount: rows.length,
      periodStart,
      periodEnd,
    });
  } catch (error) {
    console.error("Parse error:", error);

    try {
      const body = await request.clone().json().catch(() => ({}));
      if (body.statementId) {
        const supabase = await createClient();
        await supabase
          .from("statements")
          .update({
            status: "failed",
            error_message: error instanceof Error ? error.message : "Parse failed",
          })
          .eq("id", body.statementId);
      }
    } catch {
      // ignore cleanup errors
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Parse failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statementId = new URL(request.url).searchParams.get("statementId");
  if (!statementId) {
    return NextResponse.json({ error: "statementId required" }, { status: 400 });
  }

  const { data: statement } = await supabase
    .from("statements")
    .select("id, status, error_message, parsed_at")
    .eq("id", statementId)
    .eq("user_id", user.id)
    .single();

  if (!statement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(statement);
}
