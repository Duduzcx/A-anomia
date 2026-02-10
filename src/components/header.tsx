'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './search-bar';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md">
      <div className="container flex items-center justify-between h-16 max-w-7xl">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-full sm:w-auto sm:max-w-xs">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          {isLoggedIn && (
            <Button variant="ghost" className="hover:bg-white/10" asChild>
              <Link href="/posts/new">
                <PlusCircle className="w-5 h-5" />
                <span className="hidden sm:inline ml-2">Novo Post</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
