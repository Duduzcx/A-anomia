'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import SearchBar from './search-bar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = (
    <>
      <Link href="/#blog" className="transition-colors text-foreground/80 hover:text-foreground">
        Blog
      </Link>
      <Link href="/#footer" className="transition-colors text-foreground/80 hover:text-foreground">
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
    <header className={cn(
      "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm transition-all duration-300",
      scrolled ? "border-b border-border shadow-md" : "border-b border-transparent"
    )}>
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            A Anomia
          </Link>
        </div>

        <nav className="items-center hidden gap-6 text-sm font-medium md:flex">
          {navLinks}
        </nav>

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
