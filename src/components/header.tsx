'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './search-bar';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-center h-16 max-w-7xl">
        <div className="w-full max-w-md">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
