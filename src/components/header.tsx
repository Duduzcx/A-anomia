'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PlusCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';
import { Suspense, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = (path: string) => cn(
    "transition-colors hover:text-primary",
    pathname === path ? "text-primary" : "text-muted-foreground"
  );
  
  const navItems = (
    <Link href="/" className={navLinkClasses('/')} onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
        Início
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 max-w-7xl">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden font-medium md:flex md:gap-4">
            {navItems}
          </nav>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="items-center flex-1 hidden md:flex justify-center px-8">
          <div className="w-full max-w-sm">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end">
          {/* Desktop "New Post" button */}
          <div className="hidden md:flex">
            {isLoggedIn && (
              <Button variant="ghost" asChild>
                <Link href="/posts/new">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>Novo Post</span>
                </Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className='mt-6 mb-4'>
                  <Logo />
                </div>
                <div className="w-full mb-6">
                    <Suspense fallback={null}>
                        <SearchBar />
                    </Suspense>
                </div>
                <nav className="flex flex-col gap-4 font-medium">
                  {navItems}
                </nav>
                {isLoggedIn && (
                  <>
                    <div className="my-4 border-t border-border" />
                    <Button variant="default" asChild className="w-full">
                      <Link href="/posts/new" onClick={() => setIsMobileMenuOpen(false)}>
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Novo Post
                      </Link>
                    </Button>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
