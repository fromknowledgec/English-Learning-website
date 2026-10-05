import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/db/config';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

// 定义注册请求的类型
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // 验证请求数据
    if (!body.username || !body.email || !body.password || !body.fullName) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (body.username.length < 3 || body.username.length > 50) {
      return NextResponse.json(
        { error: '用户名长度必须在 3-50 个字符之间' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码强度
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: '密码长度必须至少为 6 个字符' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUserByUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, body.username));

    if (existingUserByUsername.length > 0) {
      return NextResponse.json(
        { error: '用户名已被使用' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUserByEmail.length > 0) {
      return NextResponse.json(
        { error: '邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await hash(body.password, 10);

    // 创建新用户
    const newUser = await db
      .insert(users)
      .values({
        username: body.username,
        email: body.email,
        password: hashedPassword,
        fullName: body.fullName,
        isActive: true,
      })
      .returning();

    if (newUser.length === 0) {
      return NextResponse.json(
        { error: '创建用户失败' },
        { status: 500 }
      );
    }

    // 返回成功响应
    return NextResponse.json(
      {
        message: '注册成功',
        user: {
          id: newUser[0].id,
          username: newUser[0].username,
          email: newUser[0].email,
          fullName: newUser[0].fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
