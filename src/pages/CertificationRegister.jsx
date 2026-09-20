import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import FormSuccess from '../components/forms/FormSuccess.jsx'
import {
  TextField, TextAreaField, CheckboxField, Honeypot, SubmitButton, FormError,
} from '../components/forms/FormFields.jsx'
import { useForm, isEmail } from '../lib/useForm.js'
import { payWithPaystack, paystackDemoMode } from '../lib/paystack.js'
import { certification, membership } from '../data/content.js'

// Indicative fees live in content.js (membership.dues) and are placeholders until the client confirms them.
const feeFor = (levelName) =>
  membership.dues.items.find((i) => i.label.endsWith(levelName))?.value

// The fees above are single fixed figures per level (unlike the membership
// application-fee bands), so they can be charged directly — pulled out as a
// plain number for Paystack, which wants a local-currency amount, not a display string.
const feeAmountFor = (levelName) => Number(feeFor(levelName)?.replace(/[^0-9.]/g, ''))

const validate = (v) => {
  const e = {}
  if (!v.level) e.level = 'Choose the level you are registering for.'
  if (!v.fullName.trim()) e.fullName = 'Enter your name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
  if (!v.country.trim()) e.country = 'Enter your country.'
  if (!v.role.trim()) e.role = 'Enter your current role.'
  if (v.background.trim().length < 20) e.background = 'Write at least a couple of sentences about your experience.'
  if (!v.consent) e.consent = 'Please agree so we can process your registration.'
  return e
}

const validateStepTwo = (v) => {
  const e = {}
  if (!v.fullName.trim()) e.fullName = 'Enter your name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
  if (!v.country.trim()) e.country = 'Enter your country.'
  if (!v.role.trim()) e.role = 'Enter your current role.'
  if (v.background.trim().length < 20) e.background = 'Write at least a couple of sentences about your experience.'
  return e
}

export default function CertificationRegister() {
  const [step, setStep] = useState(1)
  const [localErrors, setLocalErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [paymentRef, setPaymentRef] = useState('')

  const form = useForm({
    name: 'certification-registration',
    initial: {
      level: '', fullName: '', email: '', phone: '', country: '',
      organisation: '', role: '', background: '', consent: false,
    },
    validate,
    beforeSubmit: async (v) => {
      setPaying(true)
      try {
        const result = await payWithPaystack({
          email: v.email,
          amountUsd: feeAmountFor(v.level),
          currency: 'GHS',
          reference: `ACEL-CERT-${Date.now()}`,
          metadata: { level: v.level, fullName: v.fullName },
        })
        setPaymentRef(result.reference)
        return { paymentReference: result.reference, paymentDemo: Boolean(result.demo) }
      } finally {
        setPaying(false)
      }
    },
  })

  const { bind, onSubmit, status, submitError, values, reset } = form

  const bindWithLocalError = (field) => {
    const binding = bind(field)
    return {
      ...binding,
      error: localErrors[field] ?? binding.error,
      onChange: (e) => {
        binding.onChange(e)
        setLocalErrors((prev) => ({ ...prev, [field]: undefined }))
      },
    }
  }

  const levelBinding = bindWithLocalError('level')
  const fullNameBinding = bindWithLocalError('fullName')
  const emailBinding = bindWithLocalError('email')
  const phoneBinding = bindWithLocalError('phone')
  const countryBinding = bindWithLocalError('country')
  const roleBinding = bindWithLocalError('role')
  const organisationBinding = bindWithLocalError('organisation')
  const backgroundBinding = bindWithLocalError('background')
  const consentBinding = bindWithLocalError('consent')
  const gotchaBinding = bindWithLocalError('_gotcha')

  const steps = [
    { id: 1, label: 'Certification level' },
    { id: 2, label: 'Your details' },
    { id: 3, label: 'Review & pay' },
  ]

  const progress = ((step - 1) / (steps.length - 1)) * 100

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      document.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const goNext = () => {
    if (step === 1) {
      if (!values.level) {
        setLocalErrors({ level: 'Choose the level you are registering for.' })
        focusFirstError()
        return
      }
      setLocalErrors({})
      setStep(2)
      return
    }

    if (step === 2) {
      const errors = validateStepTwo(values)
      setLocalErrors(errors)
      if (Object.keys(errors).length > 0) {
        focusFirstError()
        return
      }
      setStep(3)
    }
  }

  const goBack = () => setStep((current) => Math.max(1, current - 1))

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <fieldset>
          <legend className="mb-3 text-[14px] font-medium text-ink/85">Certification level</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {certification.levels.map((lvl) => (
              <label
                key={lvl.name}
                className="flex cursor-pointer flex-col gap-2 rounded-xl border border-ink/15 bg-white p-4 transition-colors hover:border-gold has-[:checked]:border-emerald has-[:checked]:bg-emerald/5"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-[1.1rem] text-ink">{lvl.name}</span>
                  <input
                    type="radio"
                    name="level"
                    value={lvl.name}
                    checked={values.level === lvl.name}
                    onChange={(e) => {
                      levelBinding.onChange(e)
                      setLocalErrors((prev) => ({ ...prev, level: undefined }))
                    }}
                    aria-invalid={localErrors.level ? 'true' : undefined}
                    aria-describedby={localErrors.level ? 'level-error' : undefined}
                    className="h-4 w-4 accent-[#047622]"
                  />
                </span>
                <span className="text-[13.5px] leading-[1.55] text-ink/65">{lvl.body}</span>
                <span className="mt-auto pt-1 text-[13px] text-ink/55">
                  Fee {feeFor(lvl.name)}
                </span>
              </label>
            ))}
          </div>
          {localErrors.level && (
            <p id="level-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">
              {localErrors.level}
            </p>
          )}
        </fieldset>
      )
    }

    if (step === 2) {
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Full name" required autoComplete="name" {...fullNameBinding} />
            <TextField label="Email address" type="email" required autoComplete="email" {...emailBinding} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Phone" type="tel" autoComplete="tel" {...phoneBinding} />
            <TextField label="Country" required autoComplete="country-name" {...countryBinding} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Current role" required autoComplete="organization-title" {...roleBinding} />
            <TextField label="Organisation" autoComplete="organization" {...organisationBinding} />
          </div>
          <TextAreaField
            label="Your background"
            required
            rows={6}
            hint="Your ESG or sustainability experience, and any relevant qualifications."
            {...backgroundBinding}
          />
        </>
      )
    }

    return (
      <>
        <div className="rounded-xl border border-ink/10 bg-ink/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
            <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink/50">Selected level</span>
            <span className="font-display text-[1.4rem] text-ink">{values.level}</span>
          </div>
          <dl className="grid gap-4 text-[14px] leading-[1.7] text-ink/70 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-ink">Full name</dt>
              <dd>{values.fullName || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Email</dt>
              <dd>{values.email || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Country</dt>
              <dd>{values.country || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Role</dt>
              <dd>{values.role || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-ink">Background</dt>
              <dd>{values.background || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/5 px-5 py-4 text-[13.5px] leading-[1.6] text-ink/70">
          {paystackDemoMode ? (
            <>
              <strong className="text-ink">Payment (demo mode).</strong> Paystack is not connected to a
              live key yet, so submitting will simulate a successful payment rather than charge a card.
            </>
          ) : (
            <>
              <strong className="text-ink">Payment via Paystack.</strong> Submitting opens a secure
              Paystack checkout for {feeFor(values.level)}. Your registration is sent once payment succeeds.
            </>
          )}
        </div>

        <CheckboxField {...consentBinding} checked={values.consent}>
          I agree that ACEL may use these details to process my registration and contact me, as described in the{' '}
          <Link to="/privacy" className="text-emerald underline underline-offset-2">privacy policy</Link>.
        </CheckboxField>
        <Honeypot value={values._gotcha} onChange={gotchaBinding.onChange} />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Register for certification"
        intro="Choose your level and tell us about your background. The Secretariat reviews every registration by hand and replies by email."
      />

      <section className="section-light py-14 md:py-20">
        <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,20,45,0.25)] md:p-10">
              {status === 'success' ? (
                <FormSuccess
                  title="Registration received"
                  onReset={() => { reset(); setPaymentRef(''); setStep(1); setLocalErrors({}) }}
                  resetLabel="Register another person"
                >
                  <p>
                    Thank you, {values.fullName.split(' ')[0]}. We&rsquo;ve recorded your registration for the{' '}
                    {values.level} level and payment of {feeFor(values.level)} has been received
                    {paymentRef && <> (reference <span className="font-medium text-ink">{paymentRef}</span>)</>}.
                    The Secretariat will review it and write to {values.email} about next steps.
                  </p>
                </FormSuccess>
              ) : (
                <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-8">
                  <div className="mb-2">
                    <div className="mb-3 flex items-center justify-between text-[12px] font-medium uppercase tracking-[0.12em] text-ink/55">
                      <span>Progress</span>
                      <span>{step}/{steps.length}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald to-gold transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-4 flex justify-between gap-3 text-[12px] font-medium text-ink/60">
                      {steps.map((item) => (
                        <span key={item.id} className={item.id === step ? 'text-ink' : ''}>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {renderStepContent()}

                  {status === 'error' && <FormError message={submitError} />}

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink/30"
                      >
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < steps.length ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink/90"
                      >
                        Continue
                      </button>
                    ) : (
                      <SubmitButton busy={status === 'submitting'} busyLabel={paying ? 'Waiting for payment…' : 'Submitting…'}>
                        {`Pay ${feeFor(values.level)} & submit registration`}
                      </SubmitButton>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="order-2 lg:order-1 lg:col-span-3">
            <h2 className="font-display text-[1.35rem] leading-snug text-ink">Before you register</h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
              Not sure which level fits? Read about the{' '}
              <Link to="/certification" className="text-emerald underline underline-offset-2">three levels</Link>{' '}
              first, or{' '}
              <Link to="/contact" className="text-emerald underline underline-offset-2">ask us</Link>.
            </p>
            <p className="mt-4 text-[14px] leading-[1.7] text-ink/55">
              Fees shown are indicative and may change before they are confirmed.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
