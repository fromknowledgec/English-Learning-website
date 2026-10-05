import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { db } from '@/db/config';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

// 定义用户类型
declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
  }

  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      fullName: string;
    };
  }
}

const authOptions: AuthOptions = {
  // 配置认证提供者
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 查找用户
          const [user] = await db.select().from(users).where(eq(users.email, credentials.email));

          if (!user) {
            return null;
          }

          // 验证密码
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // 返回用户信息
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  // 配置会话管理
  session: {
    strategy: 'jwt',
  },
  // 配置 JWT 回调
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.fullName = token.fullName as string;
      }
      return session;
    },
  },
  // 配置页面
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
