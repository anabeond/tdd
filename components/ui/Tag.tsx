import { cn } from '@/lib/cn'

type TagProps = {
  label: string
  icon?: string
  variant?: 'pill' | 'badge'
  className?: string
}

export function Tag({ label, icon, variant = 'pill', className }: TagProps) {
  if (variant === 'badge') {
    return (
      <span
        className={cn('font-bold text-[16px] text-accent', className)}
        style={{ letterSpacing: '-0.32px' }}
      >
        {label}
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 !bg-gray-800 !px-4 !py-2 rounded-none shrink-0 cursor-pointer transition-colors duration-300 hover:bg-gray-700', className)}>
      {icon && <img src={icon} alt="" className="size-6 object-contain brightness-0 invert" />}
      <span className="font-bold text-[16px] !text-[#fafafa] whitespace-nowrap">{label}</span>
    </div>
  )
}
