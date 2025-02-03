import Link from "next/link"

type CHAT = {
  id: number
  name: string
  createdAt: Date
  userId: string
}

interface SideBarProps {
  userChats: CHAT[]
  checkedChats: number[]
  onCheckChat: (chatId: number) => void
}

const SideBar = ({ userChats, checkedChats, onCheckChat }: SideBarProps) => {
  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-neutral-500 rounded-lg sm:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <div
        id="default-sidebar"
        className="fixed absolute top-0 left-0 z-30 max-w-64 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      >
        <div className="h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-800">
          <ul className="space-y-2 font-medium p-2">
            {userChats?.map((chat: CHAT) => (
              <li
                key={chat.id}
                className="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
              >
               
                <Link href={`/${chat.id}`} className="flex items-center flex-grow truncate">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pin pin absolute h-4 w-4 transition-opacity opacity-0"
                  >
                    <path d="M12 17v5"></path>
                    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
                  </svg>
                  <span className="font-medium truncate overflow-x-hidden ">{chat.name}</span>
                </Link>
                <input
                  type="checkbox"
                  checked={checkedChats.includes(chat.id)}
                  onChange={() => onCheckChat(chat.id)}
                  className="ml-2 p-2 cursor-pointer"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar

