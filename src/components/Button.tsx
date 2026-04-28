import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

type Variant = 'pink' | 'purple' | 'blue' | 'yellow' | 'green' | 'orange' | 'gray'

const variantClass: Record<Variant, string> = {
  pink: 'bg-candy-pink text-white',
  purple: 'bg-candy-purple text-white',
  blue: 'bg-candy-blue text-white',
  yellow: 'bg-candy-yellow text-amber-900',
  green: 'bg-candy-green text-emerald-900',
  orange: 'bg-candy-orange text-white',
  gray: 'bg-white/80 text-slate-700 border-2 border-slate-200',
}

type Props = HTMLMotionProps<'button'> & {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

export function Button({
  variant = 'pink',
  size = 'md',
  children,
  className = '',
  ...rest
}: Props) {
  const sizeClass =
    size === 'xl'
      ? 'px-6 py-4 text-2xl sm:px-10 sm:py-6 sm:text-3xl rounded-2xl sm:rounded-3xl'
      : size === 'lg'
        ? 'px-6 py-4 text-xl sm:px-8 sm:py-5 sm:text-2xl rounded-2xl sm:rounded-3xl'
        : size === 'sm'
          ? 'px-3 py-2 text-sm sm:px-4 sm:text-base rounded-xl'
          : 'px-5 py-2.5 text-lg sm:px-6 sm:py-3 sm:text-xl rounded-2xl'
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.02 }}
      className={`font-display font-bold shadow-toy active:shadow-toy-sm select-none ${variantClass[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
