'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get('query')?.toString() || '');

  useEffect(() => {
    // The search logic of automatically updating the URL should only apply to the homepage.
    if (pathname !== '/') {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
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
  }, [query, router, searchParams, pathname]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar no blog..."
        className="w-full pl-8 bg-secondary border-border placeholder:text-muted-foreground focus:ring-ring h-9"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
    </div>
  )
}
