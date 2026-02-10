'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query')?.toString() || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }
      router.replace(`/blog?${params.toString()}`);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar no blog..."
        className="w-full pl-8 bg-transparent border-border placeholder:text-muted-foreground focus:bg-secondary focus:ring-ring h-9"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
    </div>
  )
}
