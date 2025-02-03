import { redirect } from "next/navigation";
import { checkAuthentication } from "../actions";

// app/sign-in/layout.tsx
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userID = await checkAuthentication();
  console.log('layout signin userID', userID);
  
  if (userID) {
    return redirect("/");
  }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
        <main className="text-center">{children}</main>
      </div>
    );
  }