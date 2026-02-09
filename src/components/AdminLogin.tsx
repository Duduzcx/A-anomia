'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function AdminLogin() {
  const { isLoggedIn, login, logout } = useAuth();

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
                        <Button onClick={login}>Login as Author</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
