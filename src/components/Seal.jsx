const LOGO_SRC = '/acel-logo.jpeg'

export default function Seal({ size = 40, className = '' }) {
  return (
    <img
      width={size}
      height={size}
      src={LOGO_SRC}
      alt="ACEL logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}