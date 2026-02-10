'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Instagram, Phone } from 'lucide-react';

export default function AdminLogin() {
  const { isLoggedIn, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  return (
    <section id="author-area" className="w-full py-20 border-t bg-secondary">
        <div className="container grid items-start max-w-5xl gap-12 px-4 mx-auto md:grid-cols-2">
            <div>
              {isLoggedIn ? (
                  <Card className="bg-background/80">
                      <CardHeader className="text-center">
                          <CardTitle className="text-2xl">Bem-vindo, Autor</CardTitle>
                          <CardDescription>Você está logado e pode gerenciar os posts.</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                          <Button asChild>
                              <Link href="/posts/new">Adicionar Novo Post</Link>
                          </Button>
                          <Button variant="outline" onClick={logout}>Sair</Button>
                      </CardContent>
                  </Card>
              ) : (
                  <Card className="bg-background/80">
                      <CardHeader className="text-center">
                          <CardTitle className="text-2xl">Área do Autor</CardTitle>
                          <CardDescription>Faça login para criar e gerenciar posts.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <form onSubmit={handleLogin} className="space-y-4">
                              <div className="space-y-2">
                                  <Label htmlFor="username">Usuário</Label>
                                  <Input 
                                      id="username"
                                      name="username"
                                      value={username} 
                                      onChange={(e) => setUsername(e.target.value)}
                                      autoComplete="username"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="password">Senha</Label>
                                  <Input 
                                      id="password" 
                                      type="password"
                                      name="password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      autoComplete="current-password"
                                  />
                              </div>
                              {error && <p className="text-sm text-center text-destructive">{error}</p>}
                              <Button type="submit" className="w-full">Entrar como Autor</Button>
                          </form>
                      </CardContent>
                  </Card>
              )}
            </div>
            <div className="p-8 text-center border rounded-lg border-border bg-background/80">
              <h3 className="text-2xl font-bold text-primary">Fale Conosco</h3>
              <p className="mt-4 text-muted-foreground">
                Tem alguma dúvida, sugestão ou quer apenas trocar uma ideia sobre filosofia? Estamos a um clique de distância.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
        </div>
    </section>
  );
}
