import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BaseProps = {
  variant?: 'outline' | 'secondary' | 'underline'
  className?: string
  children: React.ReactNode
}

type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }
type AsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = AsButton | AsAnchor

const variants = {
  // Figma primary button: large accent text + underline decoration + arrow
  outline:
    'inline-flex items-center gap-4 font-medium text-[64px] tracking-[-0.02em] text-accent underline decoration-accent underline-offset-4 hover:opacity-70 transition-opacity duration-200 cursor-pointer',
  // Secondary button: same style as primary but at 24px
  secondary:
    'inline-flex items-center gap-4 font-medium text-[24px] tracking-[-0.02em] text-accent underline decoration-accent underline-offset-4 hover:opacity-70 transition-opacity duration-200 cursor-pointer',
  // Subtle link: border-bottom style used for secondary CTAs
  underline:
    'inline-flex items-center gap-2 font-bold border-b pb-1 transition-colors duration-300 cursor-pointer',
}

export function Button({ variant = 'outline', className, children, ...props }: ButtonProps) {
  const cls = cn(variants[variant], className)

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as AsAnchor
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
