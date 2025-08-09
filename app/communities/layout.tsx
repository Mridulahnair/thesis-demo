import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communities - Knit",
  description: "Join specialized communities where generations connect over shared interests and passions.",
};

export default function CommunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}