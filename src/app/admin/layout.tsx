import { redirect } from "next/navigation";
import { getCurrentSession, isAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();
  const isAdmin = await isAdminSession(session);

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
