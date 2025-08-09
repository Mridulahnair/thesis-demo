import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search - Knit",
  description: "Find communities, mentors, and mentees all in one place.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}