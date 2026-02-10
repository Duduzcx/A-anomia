import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="p-1.5 bg-white rounded-full">
        <BrainCircuit className="w-6 h-6 text-primary" />
      </div>
      <span className="hidden text-2xl font-extrabold tracking-tight text-white sm:inline-block font-headline">
        A Anomia
      </span>
    </Link>
  );
}
