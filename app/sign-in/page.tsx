import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <SignInButton forceRedirectUrl={"/"} />
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} chatjj. All rights reserved.
      </footer>
    </>
  );
}