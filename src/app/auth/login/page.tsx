'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });

      if (result?.error) {
        setError('邮箱或密码错误，请重试');
      } else {
        // 登录成功，重定向到首页
        router.push('/');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <BookOpen className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            登录
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            欢迎回来！请登录您的账号继续学习
          </p>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-center">账号登录</CardTitle>
            <CardDescription className="text-center">
              输入您的邮箱和密码登录账号
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 错误信息 */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 记住我选项 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                <Label htmlFor="remember">记住我</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </CardFooter>
        </Card>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            还没有账号？{' '}
            <button
              onClick={() => router.push('/auth/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              立即注册
            </button>
          </p>
        </div>

        {/* 返回首页 */}
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首页</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
