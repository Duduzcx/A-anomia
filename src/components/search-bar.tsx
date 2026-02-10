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
      router.replace(`/?${params.toString()}`);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
      <Input
        type="search"
        placeholder="Buscar..."
        className="w-full pl-8 text-white bg-white/10 border-white/30 placeholder:text-white/60 focus:bg-white/20 focus:ring-white h-9"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
    </div>
  )
}
