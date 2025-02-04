"use client";

import { db } from '@/lib/dexie';
import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBar from "./SideBar";
import { toast } from 'sonner';

type CHAT = {
  id: number;
  name: string;
  timestamp: Date; // Updated to match Dexie schema
};

export const DeleteChatsWrapper = () => {
  const [checkedChats, setCheckedChats] = useState<number[]>([]);
  const [localChats, setLocalChats] = useState<CHAT[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch chats from Dexie on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userChats = await db.getAllChats();
        setLocalChats(userChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
      }
    };

    fetchChats();
  }, []);

  // Handle checking/unchecking a chat
  const handleCheckChat = useCallback((chatId: number) => {
    setCheckedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  }, []);

  // Handle deleting checked chats
  const handleDeleteChecked = useCallback(async () => {
    const chatsToDelete = localChats.filter(chat => checkedChats.includes(chat.id));

    // Optimistically update local state
    setLocalChats(prevChats => prevChats.filter(chat => !checkedChats.includes(chat.id)));
    setCheckedChats([]);

    try {
      
      
      await db.deleteMultipleChats(checkedChats);
      if (checkedChats.some(chat => pathname.includes(`/${chat}`))) {
        router.push("/"); // Redirect to home or another safe page
      }

      toast.success('Chats deleted successfully');
    } catch (error) {
      // Revert local state if deletion fails
      setLocalChats(prevChats => [...prevChats, ...chatsToDelete]);
      toast.error('Failed to delete chats');
    }
  }, [checkedChats, localChats, pathname, router]);

  return (
    <>
      <SideBar
        userChats={localChats}
        checkedChats={checkedChats}
        onCheckChat={handleCheckChat}
      />
      <div
        className={`fixed bottom-0 ${checkedChats.length === 0 ? 'opacity-0' : "opacity-100"} transition-all duration-300 left-0 w-64 p-4 bg-neutral-100 dark:bg-neutral-700 z-50`}
      >
        <button
          onClick={handleDeleteChecked}
          disabled={checkedChats.length === 0}
          className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-0 opacity-100 transition-all duration-300 disabled:cursor-not-allowed"
        >
          Delete Checked ({checkedChats.length})
        </button>
      </div>
    </>
  );
};