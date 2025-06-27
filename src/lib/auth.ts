import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Credentials provider for demo, sign-up, and sign-in
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@example.com",
        },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        console.log("Attempting authentication for:", credentials.email);

        try {
          const isSignUp = credentials.isSignUp === "true";

          // Demo account shortcut
          if (
            credentials.email === "demo@example.com" &&
            credentials.password === "demo123"
          ) {
            let user = await prisma.user.findUnique({
              where: { email: "demo@example.com" },
            });

            if (!user) {
              console.log("Creating new demo user...");
              user = await prisma.user.create({
                data: {
                  email: "demo@example.com",
                  name: "Demo User",
                  role: "USER",
                },
              });
              console.log("Demo user created:", user);
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          if (isSignUp) {
            // Sign-up flow: Create new user with role
            console.log("Sign-up flow detected");

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (existingUser) {
              console.log("User already exists");
              throw new Error("User already exists with this email");
            }

            // Create new user with hashed password and role
            const hashedPassword = await bcrypt.hash(credentials.password, 12);
            const userRole = credentials.role === "ADMIN" ? "ADMIN" : "USER";

            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.name || credentials.email.split("@")[0],
                password: hashedPassword,
                role: userRole,
              },
            });

            console.log("New user created:", {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role,
            });

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            };
          } else {
            // Sign-in flow: Authenticate existing user
            console.log("Sign-in flow detected");

            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user || !user.password) {
              console.log("User not found or no password set");
              return null;
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!isPasswordValid) {
              console.log("Invalid password");
              return null;
            }

            console.log("Authentication successful for:", user.email);

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback - token:", token, "session:", session);

      if (session.user && token.sub) {
        session.user.id = token.sub;

        // Add user role if needed
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
          });
          if (dbUser) {
            session.user.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      console.log("Final session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user, "token:", token);

      if (user) {
        token.sub = user.id;
      }

      console.log("Final token:", token);
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt", // Use JWT instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug in development
};
