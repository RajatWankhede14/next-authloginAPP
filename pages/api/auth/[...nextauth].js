import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import { compare } from "bcrypt";

const options = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        phoneNumber: {
          label: "Phone Number",
          type: "number",
        },
        password: {
          label: "Password",
          type: "text",
        },
      },
      async authorize(credentials) {
        connectToMongoDB().catch((err) => {
          throw new Error(err);
        });
        const user = await User.findOne({
          phoneNumber: credentials?.phoneNumber,
        }).select("+password");
        if (!user) {
          throw new Error("Invalid Credentials");
        }

        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid Credentials");
        } else {
          return user;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      const user = token.user;
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(options);
