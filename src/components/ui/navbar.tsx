'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, BookOpen } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 左侧 Logo 和标题 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700">英萃英语学习</h1>
              <p className="text-xs text-gray-500">结合优秀材料 · 聚焦高一英语</p>
            </div>
          </div>

          {/* 右侧登录状态和用户信息 */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {session ? (
                  // 已登录状态
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={session.user.fullName} />
                          <AvatarFallback className="bg-blue-600">
                            {session.user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="flex items-center gap-2 p-2 border-b">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{session.user.fullName}</p>
                          <p className="text-xs text-gray-500">{session.user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuItem>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>学习记录</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>退出登录</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // 未登录状态
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/auth/login')}
                      className="border-blue-500 text-blue-700 hover:bg-blue-50"
                    >
                      登录
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push('/auth/register')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      注册
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
