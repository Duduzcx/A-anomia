'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
    <div className="py-12 mt-12 bg-secondary">
        <div className="container flex justify-center">
            {isLoggedIn ? (
                 <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Bem-vindo, Autor</CardTitle>
                        <CardDescription>Você está logado e pode gerenciar os posts do blog.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button asChild>
                            <Link href="/posts/new">Adicionar Novo Post</Link>
                        </Button>
                        <Button variant="outline" onClick={logout}>Sair</Button>
                    </CardContent>
                 </Card>
            ) : (
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Área do Autor</CardTitle>
                        <CardDescription>Faça login para criar e gerenciar posts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuário</Label>
                                <Input 
                                    id="username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="password"
                                />
                            </div>
                            {error && <p className="text-sm text-center text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">Entrar como Autor</Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
