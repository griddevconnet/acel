import { useId } from 'react'

const inputBase =
  'w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 ' +
  'transition-colors focus:border-gold'

function Shell({ id, label, required, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-ink/85">
        {label}
        {!required && <span className="ml-1.5 font-normal text-ink/50">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-ink/55">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  )
}

const describe = (id, hint, error) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined

export function TextField({ label, required = false, hint, error, type = 'text', ...rest }) {
  const id = useId()
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describe(id, hint, error)}
        className={`${inputBase} ${error ? 'border-[#B42318]' : 'border-ink/15'}`}
        {...rest}
      />
    </Shell>
  )
}

export function TextAreaField({ label, required = false, hint, error, rows = 5, ...rest }) {
  const id = useId()
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describe(id, hint, error)}
        className={`${inputBase} resize-y leading-[1.6] ${error ? 'border-[#B42318]' : 'border-ink/15'}`}
        {...rest}
      />
    </Shell>
  )
}

export function SelectField({ label, required = false, hint, error, options, placeholder = 'Select one', ...rest }) {
  const id = useId()
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describe(id, hint, error)}
        className={`${inputBase} ${error ? 'border-[#B42318]' : 'border-ink/15'}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </Shell>
  )
}

export function CheckboxField({ children, error, name, checked, onChange }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.6] text-ink/75">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[#047622]"
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  )
}

// The bot trap. Hidden from people and assistive tech; bots tend to fill it.
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
      </label>
    </div>
  )
}

export function SubmitButton({ busy, busyLabel = 'Sending…', children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="liquid-btn liquid-btn-hero disabled:cursor-not-allowed disabled:opacity-60"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <span className="liquid-blob" />
      <span className="liquid-blob two" />
      <span className="liquid-label">{busy ? busyLabel : children}</span>
    </button>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg border border-[#B42318]/30 bg-[#B42318]/5 px-4 py-3 text-[14px] text-[#B42318]">
      {message}
    </p>
  )
}
