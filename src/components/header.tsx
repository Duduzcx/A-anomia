'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const navLinkClasses = (path: string) => cn(
    "transition-colors hover:text-primary",
    pathname === path ? "text-primary" : "text-muted-foreground"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 max-w-7xl">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden font-medium md:flex md:gap-4">
            <Link href="/blog" className={navLinkClasses('/blog')}>
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn && (
            <Button variant="ghost" asChild>
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
