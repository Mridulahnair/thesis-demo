import { ProfileContent } from "./client-page";

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileContent id={id} />;
}