import type { Metadata } from "next"
import { SearchPage } from "@/components/search-page"

export const metadata: Metadata = {
  title: "Search - DocuFlow",
  description: "Search and discover documents across your organization",
}

export default function Search() {
  return <SearchPage />
}
