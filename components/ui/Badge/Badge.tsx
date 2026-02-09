import { ReactNode } from "react"
import { tv, type VariantProps } from "tailwind-variants"

const badge = tv({
  base: 'inline-flex items-center gap-[.25em] rounded-full px-[0.75em] py-[.25em] font-medium inset-ring [&_iconify-icon]:text-[1.5em]',
  variants: {
    variant: {
      primary: 'bg-blue-50 border-blue-100 text-blue-400',
      secondary: '',
      success: '',
      warning: 'bg-amber-100 text-amber-600 inset-ring-amber-100/20',
      danger: 'bg-red-100 text-red-600 inset-ring-red-100/20',
    },
    size: {
      sm: 'text-sm',
      base: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm'
  }
})

type BadgeProps =
  React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge> &
  {
    children: React.ReactNode;
  }

export default function Badge({
  children,
  variant,
  size,
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={badge({ variant, size, className })}
      {...props}
    >
      {children}
    </div>
  )
}