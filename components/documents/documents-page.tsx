"use client";

import { useState } from "react";
import { DocumentList } from "@/components/documents/document-list";
import { DocumentUpload } from "@/components/documents/document-upload";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/client";
export function DocumentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const supabaseReady = isSupabaseBrowserConfigured();

  const handleUploaded = () => {
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-8 overflow-y-auto px-4 py-8 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload lease and maintenance PDFs. Files go to Supabase Storage;
          metadata is saved in PostgreSQL.
        </p>
      </div>

      {!supabaseReady ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          <p className="font-medium">Supabase not configured</p>
          <p className="mt-1 text-amber-800/90 dark:text-amber-100/90">
            Copy <code className="rounded bg-background/50 px-1">.env.example</code> to{" "}
            <code className="rounded bg-background/50 px-1">.env.local</code>, add your
            Supabase keys, run <code className="rounded bg-background/50 px-1">supabase/schema.sql</code>, then
            restart <code className="rounded bg-background/50 px-1">npm run dev</code>.
            See <code className="rounded bg-background/50 px-1">supabase/SETUP.md</code>.
          </p>
        </div>
      ) : null}

      <DocumentUpload
        onUploaded={handleUploaded}
        disabled={!supabaseReady}
      />

      <DocumentList refreshKey={refreshKey} />
    </div>
  );
}
