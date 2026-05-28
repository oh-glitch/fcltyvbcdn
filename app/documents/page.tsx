import { DocumentsPage } from "@/components/documents/documents-page";
import { AppHeader } from "@/components/layout/app-header";

export default function DocumentsRoutePage() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <AppHeader
        title="Documents"
        subtitle="Upload and manage facility PDFs"
      />
      <main className="min-h-0 flex-1">
        <DocumentsPage />
      </main>
    </div>
  );
}
