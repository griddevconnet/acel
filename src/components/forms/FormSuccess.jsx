export default function FormSuccess({ title, children, onReset, resetLabel }) {
  return (
    <div role="status" className="py-4 md:py-8">
      <span
        aria-hidden="true"
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 text-emerald"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h2 className="font-display text-[1.8rem] leading-[1.15] text-ink">{title}</h2>
      <div className="mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-ink/70">{children}</div>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-8 text-[14.5px] font-medium text-emerald underline underline-offset-4 hover:text-emerald-deep"
        >
          {resetLabel}
        </button>
      )}
    </div>
  )
}
