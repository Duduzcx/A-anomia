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
      setError('Invalid username or password.');
      setPassword('');
    } else {
      setError('');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="py-12 mt-12 bg-secondary">
        <div className="container max-w-2xl text-center">
            {isLoggedIn ? (
                 <Card>
                    <CardHeader>
                        <CardTitle>Welcome, Author</CardTitle>
                        <CardDescription>You are logged in and can manage the blog posts.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button asChild>
                            <Link href="/posts/new">Add New Post</Link>
                        </Button>
                        <Button variant="outline" onClick={logout}>Logout</Button>
                    </CardContent>
                 </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Author Area</CardTitle>
                        <CardDescription>Login to create and manage posts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4 text-left">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input 
                                    id="username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="password"
                                />
                            </div>
                            {error && <p className="text-sm text-center text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">Login as Author</Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
