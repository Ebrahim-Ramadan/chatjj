import InstallButton from "./PWA/InstallButton"

export default function UnlimitedMessages() {
  return (
    <div className="max-w-md p-6 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-zinc-100 rounded-xl border border-zinc-800 shadow-xl hover:shadow-emerald-500/10 transition-shadow duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="bg-emerald-500/10 p-2 rounded-lg"
            >
              <ZapIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">chatjj</h3>
              <p className="text-xs text-zinc-400">For Everyone</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full">
            <InfinityIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Unlimited</span>
          </div>
        </div>

        {/* <Progress
          value={100}
          className="h-2.5 bg-zinc-800"
          indicatorClassName="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"
        /> */}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Status</span>
            <span className="text-emerald-400 font-medium">Always Available</span>
          </div>

          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1 text-zinc-400">
              <CloudIcon className="w-3 h-3" />
              <span>No Cloud Required</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <LockIcon className="w-3 h-3" />
              <span>100% Private</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            AWESOME FEATURES UNLOCKED
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {["No Limits", "Offline Mode", "Custom Models", "Zero Latency"].map((feature) => (
              <span key={feature} className="text-xs bg-zinc-800/50 text-zinc-300 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
          {/* <InstallButton/> */}
        </div>
      </div>
    </div>
  )
}



interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

const InfinityIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.739-8z" />
  </svg>
)

export const ZapIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const CloudIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
)

const LockIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

