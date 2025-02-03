import { redirect } from "next/navigation";
import { getUser } from "../actions";
export default async function HomePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

//   if (user) {
// console.log('yes');
//     return redirect("/");
//   }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
        <main className="text-center">{children}</main>
      </div>
    );
  }