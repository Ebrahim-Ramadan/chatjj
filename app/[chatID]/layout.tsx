// app/[chatID]/layout.tsx
import {SideBar} from "@/components/Sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full">
      {children}
      {/* <SideBar /> */}
    </div>
  );
}