'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Instagram, Phone, Copyright } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Footer() {
  const { isLoggedIn, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
      setPassword('');
    } else {
      setError('');
      setUsername('');
      setPassword('');
    }
  };
  
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="w-full py-12 text-white border-t bg-secondary">
      <div className="container grid max-w-6xl gap-8 px-4 mx-auto md:grid-cols-4 sm:px-6 lg:px-8">
        
        {/* About Section */}
        <div className="flex flex-col md:col-span-2">
          <h3 className="text-xl font-bold">A Anomia</h3>
          <p className="mt-2 text-muted-foreground">
            Um blog contemporâneo sobre filosofia. Explorando as grandes questões da vida em um mundo em constante mudança.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h4 className="font-semibold tracking-wider uppercase">Navegação</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" onClick={handleHomeClick} className="transition-colors text-muted-foreground hover:text-white">
                Início
              </Link>
            </li>
            <li>
              {isHome ? (
                <a href="#blog" className="transition-colors text-muted-foreground hover:text-white">Blog</a>
              ) : (
                <Link href="/#blog" className="transition-colors text-muted-foreground hover:text-white">Blog</Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#footer" className="transition-colors text-muted-foreground hover:text-white">Contato</a>
              ) : (
                <Link href="/#footer" className="transition-colors text-muted-foreground hover:text-white">Contato</Link>
              )}
            </li>
            {isLoggedIn && (
              <li><Link href="/posts/new" className="transition-colors text-muted-foreground hover:text-white">Novo Post</Link></li>
            )}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="font-semibold tracking-wider uppercase">Contato</h4>
          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/a_anomia_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white">
              <Instagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://wa.me/551199999999" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white">
              <Phone className="w-6 h-6" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Author Area & Copyright */}
      <div className="container max-w-6xl px-4 mx-auto mt-12 border-t border-border pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Login Form */}
          <div>
            {isLoggedIn ? (
                <div className="text-center md:text-left">
                    <h4 className="font-semibold">Bem-vindo, Autor</h4>
                    <p className="text-sm text-muted-foreground">Você está logado. O que vamos criar hoje?</p>
                    <div className="flex flex-col gap-2 mt-4 sm:flex-row">
                        <Button onClick={() => router.push('/posts/new')}>Adicionar Novo Post</Button>
                        <Button variant="outline" onClick={logout}>Sair</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <h4 className="font-semibold text-center md:text-left">Área do Autor</h4>
                    <form onSubmit={handleLogin} className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-end">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="footer-username" className="sr-only">Usuário</Label>
                            <Input 
                                id="footer-username"
                                name="username"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Usuário"
                                autoComplete="username"
                                className="bg-background/50"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="footer-password"  className="sr-only">Senha</Label>
                            <Input 
                                id="footer-password" 
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                autoComplete="current-password"
                                className="bg-background/50"
                            />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">Entrar</Button>
                    </form>
                    {error && <p className="mt-2 text-sm text-center text-destructive sm:text-left">{error}</p>}
                </div>
            )}
          </div>
          {/* Copyright */}
          <div className="flex items-end justify-center text-sm text-muted-foreground md:justify-end">
            <p className="flex items-center gap-1.5">
              <Copyright className="w-4 h-4" /> {new Date().getFullYear()} A Anomia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}