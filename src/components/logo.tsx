import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-xl font-extrabold tracking-tight font-headline text-foreground">
        A Anomia
      </span>
    </Link>
  );
}
