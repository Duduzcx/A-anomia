import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group shrink-0">
      <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
        <BrainCircuit className="w-6 h-6" />
      </div>
      <span className="hidden text-xl font-bold sm:inline-block font-headline text-foreground">
        PhiloThoughts
      </span>
    </Link>
  );
}
