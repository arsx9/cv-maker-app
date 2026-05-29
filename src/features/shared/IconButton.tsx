import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonVariant = 'primary' | 'secondary' | 'danger'

type IconButtonProps = {
  label: string
  icon: ReactNode
  variant?: IconButtonVariant
  solid?: boolean
  isLoading?: boolean
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled' | 'type'>

export function IconButton({
  label,
  icon,
  variant = 'secondary',
  solid = false,
  isLoading = false,
  disabled,
  onClick,
  type = 'button',
}: IconButtonProps) {
  const styleClass = solid ? `btn-${variant}` : `btn-outline-${variant}`

  return (
    <button
      type={type}
      className={`btn btn-icon ${styleClass}`}
      aria-label={label}
      title={label}
      aria-busy={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
