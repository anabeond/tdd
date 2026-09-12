import { cn } from '@/lib/cn'

type TabProps = {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export function Tab({ label, active, onClick, className }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-10 !px-4 !py-2 rounded-none font-bold text-[16px] transition-all duration-300 whitespace-nowrap cursor-pointer',
        active ? 'bg-brand text-[#fafafa]' : 'bg-gray-800 text-[#fafafa] hover:bg-gray-700',
        className
      )}
    >
      {label}
    </button>
  )
}
