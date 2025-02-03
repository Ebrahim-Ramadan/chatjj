"use client"
import { db } from '@/lib/dexie'
import { deleteChatsSequentially } from "@/app/actions"
import type React from "react"
import { useState, useCallback } from "react"
import SideBar from "./SideBar"
import { toast } from 'sonner';

type CHAT = {
  id: number
  name: string
  createdAt: Date
  userId: string
}

interface DeleteChatsWrapperProps {
  userChats: CHAT[]
  userID: any
}

export const DeleteChatsWrapper: React.FC<DeleteChatsWrapperProps> = ({
  userChats,
  userID,
}) => {
  const [checkedChats, setCheckedChats] = useState<number[]>([])
  const [localChats, setLocalChats] = useState<CHAT[]>(userChats)

  const handleCheckChat = useCallback((chatId: number) => {
    setCheckedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    )
  }, [])

  const handleDeleteChecked = useCallback(async () => {
    // Optimistic update: Remove the checked chats from the local state
    const chatsToDelete = localChats.filter(chat => checkedChats.includes(chat.id))
    setLocalChats(prevChats => prevChats.filter(chat => !checkedChats.includes(chat.id)))
    setCheckedChats([])

    try {
      // Perform the actual deletion
      for (const chatId of checkedChats) {
        await db.deleteAllMessagesInChat(chatId)
        await deleteChatsSequentially(chatId, userID)
      }
      toast.success('Chat deleted')
    } catch (error) {
      // Revert the local state if the deletion fails
      setLocalChats(prevChats => [...prevChats, ...chatsToDelete])
      toast.error('Failed to delete chats')
    }
  }, [checkedChats, localChats, userID])

  return (
    <>
      <SideBar
        userChats={localChats}
        checkedChats={checkedChats}
        onCheckChat={handleCheckChat}
      />
      <div
        className={`fixed bottom-0 ${
          checkedChats.length === 0 ? 'opacity-0' : "opacity-100"
        } transition-all duration-300 left-0 w-64 p-4 bg-neutral-100 dark:bg-neutral-700 z-50`}
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
  )
}