import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  providers.push(
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    })
  );
}

// Debug log to confirm secret is present in production (safely)
if (process.env.NODE_ENV === 'production') {
  console.log('NextAuth: Running in production mode');
  console.log('NextAuth: AUTH_SECRET is', process.env.AUTH_SECRET ? 'present' : 'MISSING');
  console.log('NextAuth: NEXTAUTH_SECRET is', process.env.NEXTAUTH_SECRET ? 'present' : 'MISSING');
  console.log('NextAuth: Providers configured:', providers.map(p => (p as any).id || (p as any).name).join(', '));
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = (profile as any).sub || (profile as any).id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && (token.sub || token.id)) {
        session.user.id = (token.sub || token.id) as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
  pages: {
    signIn: '/',
  },
});
