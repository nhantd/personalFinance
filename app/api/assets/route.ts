import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const assetKindSchema = z.enum(["investment", "property", "other", "liability"]);

const createSchema = z.object({
  kind: assetKindSchema,
  subtype: z.string().min(1),
  name: z.string().min(1),
  currency: z.string().min(3).max(3),
  value: z.number().min(0),
  debt: z.number().min(0).optional(),
  institution: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  as_of_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const patchSchema = createSchema.partial().extend({
  id: z.string().uuid(),
});

async function writeSnapshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  asset: {
    id: string;
    value: number;
    debt: number;
    currency: string;
    as_of_date: string;
  }
) {
  await supabase.from("asset_snapshots").upsert(
    {
      asset_id: asset.id,
      user_id: userId,
      recorded_at: asset.as_of_date,
      value: asset.value,
      debt: asset.debt ?? 0,
      currency: asset.currency,
    },
    { onConflict: "asset_id,recorded_at" }
  );
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");

  let query = supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (kind) {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assets: data ?? [] });
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
  const asOfDate = body.as_of_date ?? new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("assets")
    .insert({
      user_id: user.id,
      kind: body.kind,
      subtype: body.subtype,
      name: body.name,
      currency: body.currency.toUpperCase(),
      value: body.value,
      debt: body.debt ?? 0,
      institution: body.institution ?? null,
      notes: body.notes ?? null,
      as_of_date: asOfDate,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeSnapshot(supabase, user.id, data);

  return NextResponse.json({ asset: data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = patchSchema.parse(await request.json());
  const { id, ...updates } = body;

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.kind !== undefined) payload.kind = updates.kind;
  if (updates.subtype !== undefined) payload.subtype = updates.subtype;
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.currency !== undefined) payload.currency = updates.currency.toUpperCase();
  if (updates.value !== undefined) payload.value = updates.value;
  if (updates.debt !== undefined) payload.debt = updates.debt;
  if (updates.institution !== undefined) payload.institution = updates.institution;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.as_of_date !== undefined) payload.as_of_date = updates.as_of_date;

  const { data, error } = await supabase
    .from("assets")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeSnapshot(supabase, user.id, data);

  return NextResponse.json({ asset: data });
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
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("assets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
