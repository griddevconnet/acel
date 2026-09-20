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
// plain number for Paystack, which wants a dollar amount, not a display string.
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

export default function CertificationRegister() {
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
  const levelBinding = bind('level')

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
                  onReset={() => { reset(); setPaymentRef('') }}
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
                              onChange={levelBinding.onChange}
                              aria-invalid={levelBinding.error ? 'true' : undefined}
                              aria-describedby={levelBinding.error ? 'level-error' : undefined}
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
                    {levelBinding.error && (
                      <p id="level-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">
                        {levelBinding.error}
                      </p>
                    )}
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField label="Full name" required autoComplete="name" {...bind('fullName')} />
                    <TextField label="Email address" type="email" required autoComplete="email" {...bind('email')} />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField label="Phone" type="tel" autoComplete="tel" {...bind('phone')} />
                    <TextField label="Country" required autoComplete="country-name" {...bind('country')} />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField label="Current role" required autoComplete="organization-title" {...bind('role')} />
                    <TextField label="Organisation" autoComplete="organization" {...bind('organisation')} />
                  </div>
                  <TextAreaField
                    label="Your background"
                    required
                    rows={6}
                    hint="Your ESG or sustainability experience, and any relevant qualifications."
                    {...bind('background')}
                  />

                  <CheckboxField {...bind('consent')} checked={values.consent}>
                    I agree that ACEL may use these details to process my registration and contact me, as described in the{' '}
                    <Link to="/privacy" className="text-emerald underline underline-offset-2">privacy policy</Link>.
                  </CheckboxField>
                  <Honeypot value={values._gotcha} onChange={bind('_gotcha').onChange} />
                  {status === 'error' && <FormError message={submitError} />}

                  <div className="rounded-xl border border-gold/30 bg-gold/5 px-5 py-4 text-[13.5px] leading-[1.6] text-ink/70">
                    {paystackDemoMode ? (
                      <>
                        <strong className="text-ink">Payment (demo mode).</strong> Paystack is not connected to a
                        live key yet, so submitting will simulate a successful payment rather than charge a card.
                      </>
                    ) : (
                      <>
                        <strong className="text-ink">Payment via Paystack.</strong> Submitting opens a secure
                        Paystack checkout for {values.level ? feeFor(values.level) : 'the level fee'}. Your
                        registration is sent once payment succeeds.
                      </>
                    )}
                  </div>

                  <div>
                    <SubmitButton busy={status === 'submitting'} busyLabel={paying ? 'Waiting for payment…' : 'Submitting…'}>
                      {`Pay${values.level ? ` ${feeFor(values.level)}` : ''} & submit registration`}
                    </SubmitButton>
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
