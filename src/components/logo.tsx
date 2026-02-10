import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-primary">
        <BrainCircuit className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="hidden text-xl font-extrabold tracking-tight sm:inline-block font-headline text-foreground">
        A Anomia
      </span>
    </Link>
  );
}
