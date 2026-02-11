'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
    }
    
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        key={searchParams.get('query')} // Reset input when query changes
        type="search"
        name="query"
        placeholder="Buscar no blog..."
        className="w-full pl-8 bg-secondary border-border placeholder:text-muted-foreground focus:ring-ring h-9"
        defaultValue={searchParams.get('query') || ''}
      />
    </form>
  )
}
