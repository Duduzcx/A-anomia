'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PlusCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './search-bar';
import { Suspense, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 max-w-7xl">
        <Logo />

        {/* Desktop Right side: Search and Actions */}
        <div className="items-center hidden gap-4 md:flex">
            <div className="w-full max-w-xs">
                <Suspense fallback={null}>
                <SearchBar />
                </Suspense>
            </div>
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
                {isLoggedIn && (
                    <Button variant="default" asChild className="w-full">
                      <Link href="/posts/new" onClick={() => setIsMobileMenuOpen(false)}>
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Novo Post
                      </Link>
                    </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>

      </div>
    </header>
  );
}
