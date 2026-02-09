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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-14 max-w-screen-2xl">
        <Logo />
        <div className="flex items-center flex-1 ml-auto space-x-2 sm:space-x-4">
          <nav className="items-center hidden space-x-6 text-sm font-medium md:flex">
            <Link href="/" className="transition-colors text-foreground/60 hover:text-foreground/80">
              Blog
            </Link>
          </nav>
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4">
            <div className="w-full sm:w-auto sm:max-w-xs">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
            {isLoggedIn && (
              <Button asChild>
                <Link href="/posts/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Novo Post</span>
                  <span className="sm:hidden">Novo</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
