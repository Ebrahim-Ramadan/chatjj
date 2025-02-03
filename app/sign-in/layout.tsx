// app/sign-in/layout.tsx

import { redirect } from "next/navigation";
import { checkAuthentication } from "../actions";


export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userID = await checkAuthentication();
  if (userID) {
    return redirect("/");
  }
    return (
      <div 
      style={{ backgroundImage: "url('/globe-outline-dark-2.svg')" }}
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4 text-white">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>
        <main className="text-center z-50">{children}</main>
      </div>
    );
  }