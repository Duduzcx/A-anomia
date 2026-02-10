'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './search-bar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const navLinks = (
    <>
      <Link href="/#blog" className={cn("transition-colors text-foreground/80 hover:text-foreground", pathname === '/' ? 'text-primary' : '')}>
        Blog
      </Link>
      <Link href="/#author-area" className="transition-colors text-foreground/80 hover:text-foreground">
        Contato
      </Link>
      {isLoggedIn && (
        <Link href="/posts/new" className={cn("transition-colors text-foreground/80 hover:text-foreground", pathname === '/posts/new' ? 'text-primary' : '')}>
          Novo Post
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Newspaper className="w-6 h-6 text-primary" />
            <span>A Anomia</span>
          </Link>
          <nav className="items-center hidden gap-6 text-sm font-medium md:flex">
            {navLinks}
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden w-full max-w-sm md:block">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="w-full">
                       <Suspense fallback={null}>
                         <SearchBar />
                       </Suspense>
                    </div>
                    <nav className="flex flex-col gap-4 text-lg font-medium">
                      {navLinks}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
