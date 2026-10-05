import type { Metadata } from "next";
import { UserDetail } from "@/components/users/user-detail";

export const metadata: Metadata = { title: "User detail" };

export default async function UserDetailPage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;
  return <UserDetail userId={id} />;
}
