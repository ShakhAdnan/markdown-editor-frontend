import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">{children}</div>
    </AuthGuard>
  );
}
