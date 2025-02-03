import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function HomePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log('signed in, top level session', session);

  if (session.userId) {
    return redirect("/");
  }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
        <main className="text-center">{children}</main>
      </div>
    );
  }