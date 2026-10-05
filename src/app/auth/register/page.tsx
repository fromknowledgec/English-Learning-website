'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 表单验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度必须至少为 6 个字符');
      return;
    }

    setIsLoading(true);

    try {
      // 发送注册请求
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '注册失败，请稍后重试');
        return;
      }

      // 注册成功
      setSuccess('注册成功！即将跳转到登录页面');
      
      // 3 秒后跳转到登录页面
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError('注册失败，请稍后重试');
      console.error('Registration error:', err);
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
            注册
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            创建新账号，开始你的英语学习之旅
          </p>
        </div>

        {/* 注册表单 */}
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-center">创建账号</CardTitle>
            <CardDescription className="text-center">
              填写以下信息创建新账号
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 消息提示 */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 用户名输入 */}
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

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
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 确认密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 姓名输入 */}
              <div className="space-y-2">
                <Label htmlFor="fullName">姓名</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="请输入姓名"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={handleSubmit}
              disabled={isLoading || !!success}
            >
              {isLoading ? '注册中...' : '注册'}
            </Button>
          </CardFooter>
        </Card>

        {/* 登录链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            已有账号？{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              立即登录
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
