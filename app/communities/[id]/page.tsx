import { CommunityPageContent } from "./client-page";

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommunityPageContent id={id} />;
}