type Props = {
  value: string
  className?: string
}

export function isImageAvatar(v: string) {
  return v.startsWith('data:image') || v.startsWith('http://') || v.startsWith('https://')
}

export function KidAvatar({ value, className }: Props) {
  if (isImageAvatar(value)) {
    return (
      <span
        className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-100 align-middle ${className ?? ''}`}
      >
        <img src={value} alt="" className="w-full h-full object-cover" />
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center justify-center align-middle leading-none ${className ?? ''}`}
    >
      {value}
    </span>
  )
}
