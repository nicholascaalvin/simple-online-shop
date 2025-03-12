import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your actual login logic
        if (
          credentials?.username === "user" &&
          credentials?.password === "password"
        ) {
          // Return user object if login is successful
          return { id: 1, name: "John Doe", email: "john@example.com" };
        }
        // Return null if authentication fails
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Store session as JWT
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
});
