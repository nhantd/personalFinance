import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const uploadSchema = z.object({
  accountId: z.string().uuid().optional(),
  accountName: z.string().min(1).optional(),
  institution: z.string().optional(),
  currency: z.enum(["GBP", "USD", "EUR"]).default("USD"),
  fileType: z.enum(["csv", "pdf"]),
  fileName: z.string().min(1),
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const metadata = uploadSchema.parse({
      accountId: formData.get("accountId") || undefined,
      accountName: formData.get("accountName") || undefined,
      institution: formData.get("institution") || undefined,
      currency: formData.get("currency") || "USD",
      fileType: formData.get("fileType"),
      fileName: formData.get("fileName"),
    });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    let accountId = metadata.accountId;

    if (!accountId) {
      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .insert({
          user_id: user.id,
          name: metadata.accountName ?? "Primary Account",
          institution: metadata.institution ?? null,
          currency: metadata.currency,
        })
        .select("id")
        .single();

      if (accountError) throw accountError;
      accountId = account.id;
    }

    const statementId = crypto.randomUUID();
    const filePath = `${user.id}/${statementId}/${metadata.fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: storageError } = await supabase.storage
      .from("statements")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) throw storageError;

    const { data: statement, error: statementError } = await supabase
      .from("statements")
      .insert({
        id: statementId,
        user_id: user.id,
        account_id: accountId,
        file_path: filePath,
        file_type: metadata.fileType,
        status: "pending",
      })
      .select("id, account_id")
      .single();

    if (statementError) throw statementError;

    return NextResponse.json({
      statementId: statement.id,
      accountId: statement.account_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
