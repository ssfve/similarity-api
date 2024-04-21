import { authOptions } from "@/lib/auth";
import { redis } from "@/middleware";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants } from "./ui/Button";
import SignInButton from "./ui/SignInButton";
import SignOutButton from "./ui/SignOutButton";

let session: Session | null = null;
const Navbar = async () => {
  // after first time authentication, there is token
  getServerSession(authOptions).then((session) => {
    redis.set(`session`, session);
  });

  while (!session) {
    session = await redis.get(`session`);
  }
  console.log("Navbar session is ", session);
  return (
    <div className="fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-between">
      <div className="container max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          API v1.0 By Elvin Lin
        </Link>

        <div className="md:hidden">
          <ThemeToggle />
        </div>

        <div className="hidden md:flex gap-4">
          <ThemeToggle />
          <Link
            href="/documentation"
            className={buttonVariants({ variant: "ghost" })}
          >
            Documentation
          </Link>
          {session ? (
            <>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
