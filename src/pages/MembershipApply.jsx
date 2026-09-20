import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import FormSuccess from '../components/forms/FormSuccess.jsx'
import {
  TextField, TextAreaField, SelectField, CheckboxField, Honeypot, SubmitButton, FormError,
} from '../components/forms/FormFields.jsx'
import { useForm, isEmail } from '../lib/useForm.js'
import { membership, sectors } from '../data/content.js'

// Indicative application fee lives in content.js (membership.dues) and is a placeholder
// until the client confirms real figures.
const orgFee = membership.dues.items.find((i) => i.label.startsWith('Application fee (organisations)'))?.value
const indFee = membership.dues.items.find((i) => i.label.startsWith('Application fee (individuals)'))?.value

const validate = (stream) => (v) => {
  const e = {}
  if (stream === 'org') {
    if (!v.orgTier) e.orgTier = 'Choose the tier that fits your organisation.'
    if (!v.organisationName.trim()) e.organisationName = 'Enter your organisation\u2019s name.'
    if (!v.sector) e.sector = 'Choose a sector.'
    if (!v.country.trim()) e.country = 'Enter your country.'
    if (!v.contactName.trim()) e.contactName = 'Enter a contact name.'
    if (!v.contactRole.trim()) e.contactRole = 'Enter the contact\u2019s role.'
    if (!v.email.trim()) e.email = 'Enter an email address.'
    else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
    if (v.profile.trim().length < 20) e.profile = 'Write a couple of sentences about the organisation.'
  } else {
    if (!v.grade) e.grade = 'Choose the grade that fits your experience.'
    if (!v.fullName.trim()) e.fullName = 'Enter your name.'
    if (!v.email.trim()) e.email = 'Enter your email address.'
    else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
    if (!v.country.trim()) e.country = 'Enter your country.'
    if (!v.role.trim()) e.role = 'Enter your current role.'
    if (v.background.trim().length < 20) e.background = 'Write at least a couple of sentences about your experience.'
  }
  if (!v.consent) e.consent = 'Please agree so we can process your application.'
  return e
}

const RadioGrid = ({ name, options, value, onChange, error, describedBy, feeFor }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {options.map((opt) => (
      <label
        key={opt.name}
        className="flex cursor-pointer flex-col gap-2 rounded-xl border border-ink/15 bg-white p-4 transition-colors hover:border-gold has-[:checked]:border-emerald has-[:checked]:bg-emerald/5"
      >
        <span className="flex items-center justify-between gap-3">
          <span className="font-display text-[1.05rem] text-ink">{opt.name}</span>
          <input
            type="radio"
            name={name}
            value={opt.name}
            checked={value === opt.name}
            onChange={onChange}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? describedBy : undefined}
            className="h-4 w-4 accent-[#047622]"
          />
        </span>
        <span className="text-[13.5px] leading-[1.55] text-ink/65">{opt.body}</span>
        {feeFor && (
          <span className="mt-auto pt-1 text-[13px] text-ink/55">Indicative fee {feeFor}</span>
        )}
      </label>
    ))}
  </div>
)

function OrgFields({ bind, values, tierBinding, sectorBinding }) {
  return (
    <>
      <fieldset>
        <legend className="mb-3 text-[14px] font-medium text-ink/85">Organisational tier</legend>
        <RadioGrid
          name="orgTier"
          options={membership.orgTiers}
          value={values.orgTier}
          onChange={tierBinding.onChange}
          error={tierBinding.error}
          describedBy="orgTier-error"
          feeFor={orgFee}
        />
        {tierBinding.error && (
          <p id="orgTier-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">
            {tierBinding.error}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Organisation name" required autoComplete="organization" {...bind('organisationName')} />
        <SelectField label="Primary sector" required options={sectors.list} {...sectorBinding} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Country" required autoComplete="country-name" {...bind('country')} />
        <TextField label="Website" type="url" placeholder="https://" autoComplete="url" {...bind('website')} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Contact name" required autoComplete="name" {...bind('contactName')} />
        <TextField label="Contact role" required autoComplete="organization-title" {...bind('contactRole')} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Email address" type="email" required autoComplete="email" {...bind('email')} />
        <TextField label="Phone" type="tel" autoComplete="tel" {...bind('phone')} />
      </div>
      <TextAreaField
        label="About the organisation"
        required
        rows={6}
        hint="What the organisation does, and why it's applying for membership."
        {...bind('profile')}
      />
    </>
  )
}

function IndividualFields({ bind }) {
  return (
    <>
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
    </>
  )
}

export default function MembershipApply() {
  const [step, setStep] = useState(1)
  const [stream, setStream] = useState('org')
  const [localErrors, setLocalErrors] = useState({})

  const orgForm = useForm({
    name: 'membership-application-organisation',
    initial: {
      orgTier: '', organisationName: '', sector: '', country: '', website: '',
      contactName: '', contactRole: '', email: '', phone: '', profile: '', consent: false,
    },
    validate: validate('org'),
  })
  const indForm = useForm({
    name: 'membership-application-individual',
    initial: {
      grade: '', fullName: '', email: '', phone: '', country: '',
      role: '', organisation: '', background: '', consent: false,
    },
    validate: validate('ind'),
  })

  const form = stream === 'org' ? orgForm : indForm
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

  const tierBinding = bindWithLocalError('orgTier')
  const sectorBinding = bindWithLocalError('sector')
  const gradeBinding = bindWithLocalError('grade')
  const organisationNameBinding = bindWithLocalError('organisationName')
  const countryBinding = bindWithLocalError('country')
  const websiteBinding = bindWithLocalError('website')
  const contactNameBinding = bindWithLocalError('contactName')
  const contactRoleBinding = bindWithLocalError('contactRole')
  const emailBinding = bindWithLocalError('email')
  const phoneBinding = bindWithLocalError('phone')
  const profileBinding = bindWithLocalError('profile')
  const fullNameBinding = bindWithLocalError('fullName')
  const roleBinding = bindWithLocalError('role')
  const organisationBinding = bindWithLocalError('organisation')
  const backgroundBinding = bindWithLocalError('background')
  const consentBinding = bindWithLocalError('consent')
  const gotchaBinding = bindWithLocalError('_gotcha')

  const steps = [
    { id: 1, label: 'Stream & tier' },
    { id: 2, label: 'Your details' },
    { id: 3, label: 'Review & submit' },
  ]

  const progress = ((step - 1) / (steps.length - 1)) * 100

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      document.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const validateStepTwo = (activeStream, v) => {
    const e = {}
    if (activeStream === 'org') {
      if (!v.organisationName.trim()) e.organisationName = 'Enter your organisation’s name.'
      if (!v.sector) e.sector = 'Choose a sector.'
      if (!v.country.trim()) e.country = 'Enter your country.'
      if (!v.contactName.trim()) e.contactName = 'Enter a contact name.'
      if (!v.contactRole.trim()) e.contactRole = 'Enter the contact’s role.'
      if (!v.email.trim()) e.email = 'Enter an email address.'
      else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
      if (v.profile.trim().length < 20) e.profile = 'Write a couple of sentences about the organisation.'
      return e
    }

    if (!v.fullName.trim()) e.fullName = 'Enter your name.'
    if (!v.email.trim()) e.email = 'Enter your email address.'
    else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
    if (!v.country.trim()) e.country = 'Enter your country.'
    if (!v.role.trim()) e.role = 'Enter your current role.'
    if (v.background.trim().length < 20) e.background = 'Write at least a couple of sentences about your experience.'
    return e
  }

  const goNext = () => {
    if (step === 1) {
      const stepOneError = stream === 'org' ? !values.orgTier : !values.grade
      if (stepOneError) {
        setLocalErrors({ [stream === 'org' ? 'orgTier' : 'grade']: stream === 'org' ? 'Choose the tier that fits your organisation.' : 'Choose the grade that fits your experience.' })
        focusFirstError()
        return
      }
      setLocalErrors({})
      setStep(2)
      return
    }

    if (step === 2) {
      const errors = validateStepTwo(stream, values)
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
        <>
          <div className="mb-8 inline-flex rounded-full border border-ink/15 bg-white p-1">
            {[
              { id: 'org', label: 'Organisation' },
              { id: 'ind', label: 'Individual' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStream(tab.id)
                  setLocalErrors({})
                  if (tab.id !== stream) setStep(1)
                }}
                disabled={status === 'submitting'}
                className={`rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${
                  stream === tab.id ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {stream === 'ind' ? (
            <fieldset>
              <legend className="mb-3 text-[14px] font-medium text-ink/85">Individual grade</legend>
              <RadioGrid
                name="grade"
                options={membership.individualGrades}
                value={values.grade}
                onChange={(e) => {
                  gradeBinding.onChange(e)
                  setLocalErrors((prev) => ({ ...prev, grade: undefined }))
                }}
                error={localErrors.grade}
                describedBy="grade-error"
                feeFor={indFee}
              />
              {localErrors.grade && (
                <p id="grade-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">
                  {localErrors.grade}
                </p>
              )}
            </fieldset>
          ) : (
            <fieldset>
              <legend className="mb-3 text-[14px] font-medium text-ink/85">Organisational tier</legend>
              <RadioGrid
                name="orgTier"
                options={membership.orgTiers}
                value={values.orgTier}
                onChange={(e) => {
                  tierBinding.onChange(e)
                  setLocalErrors((prev) => ({ ...prev, orgTier: undefined }))
                }}
                error={localErrors.orgTier}
                describedBy="orgTier-error"
                feeFor={orgFee}
              />
              {localErrors.orgTier && (
                <p id="orgTier-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">
                  {localErrors.orgTier}
                </p>
              )}
            </fieldset>
          )}
        </>
      )
    }

    if (step === 2) {
      return stream === 'org' ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Organisation name" required autoComplete="organization" {...organisationNameBinding} />
            <SelectField label="Primary sector" required options={sectors.list} {...sectorBinding} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Country" required autoComplete="country-name" {...countryBinding} />
            <TextField label="Website" type="url" placeholder="https://" autoComplete="url" {...websiteBinding} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Contact name" required autoComplete="name" {...contactNameBinding} />
            <TextField label="Contact role" required autoComplete="organization-title" {...contactRoleBinding} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Email address" type="email" required autoComplete="email" {...emailBinding} />
            <TextField label="Phone" type="tel" autoComplete="tel" {...phoneBinding} />
          </div>
          <TextAreaField
            label="About the organisation"
            required
            rows={6}
            hint="What the organisation does, and why it's applying for membership."
            {...profileBinding}
          />
        </>
      ) : (
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
            <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink/50">Selected stream</span>
            <span className="font-display text-[1.3rem] text-ink">{stream === 'org' ? 'Organisation' : 'Individual'}</span>
          </div>
          <dl className="grid gap-4 text-[14px] leading-[1.7] text-ink/70 sm:grid-cols-2">
            {stream === 'org' ? (
              <>
                <div>
                  <dt className="font-medium text-ink">Tier</dt>
                  <dd>{values.orgTier || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Organisation</dt>
                  <dd>{values.organisationName || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Country</dt>
                  <dd>{values.country || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Email</dt>
                  <dd>{values.email || '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-ink">About the organisation</dt>
                  <dd>{values.profile || '—'}</dd>
                </div>
              </>
            ) : (
              <>
                <div>
                  <dt className="font-medium text-ink">Grade</dt>
                  <dd>{values.grade || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Full name</dt>
                  <dd>{values.fullName || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Country</dt>
                  <dd>{values.country || '—'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">Email</dt>
                  <dd>{values.email || '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-ink">Background</dt>
                  <dd>{values.background || '—'}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        <CheckboxField {...consentBinding} checked={values.consent}>
          I agree that ACEL may use these details to process this application and contact me, as described in the{' '}
          <Link to="/privacy" className="text-emerald underline underline-offset-2">privacy policy</Link>.
        </CheckboxField>
        <Honeypot value={values._gotcha} onChange={gotchaBinding.onChange} />
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Apply for membership"
        intro="Choose the stream that fits, then tell us a little about yourself or your organisation. The Secretariat reviews every application by hand and replies by email."
      />

      <section className="section-light py-14 md:py-20">
        <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,20,45,0.25)] md:p-10">
              {status === 'success' ? (
                <FormSuccess
                  title="Application received"
                  onReset={() => { reset(); setStep(1); setLocalErrors({}) }}
                  resetLabel="Start another application"
                >
                  {stream === 'org' ? (
                    <p>
                      Thank you. We&rsquo;ve recorded {values.organisationName}&rsquo;s application for{' '}
                      {values.orgTier} tier membership. The Secretariat will review it and write to {values.email} about next steps.
                    </p>
                  ) : (
                    <p>
                      Thank you, {values.fullName.split(' ')[0]}. We&rsquo;ve recorded your application for the{' '}
                      {values.grade} grade. The Secretariat will review it and write to {values.email} about next steps.
                    </p>
                  )}
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
                      <SubmitButton busy={status === 'submitting'}>Submit application</SubmitButton>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="order-2 lg:order-1 lg:col-span-3">
            <h2 className="font-display text-[1.35rem] leading-snug text-ink">Before you apply</h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
              Not sure which tier or grade fits? Read about{' '}
              <Link to="/membership" className="text-emerald underline underline-offset-2">membership</Link>{' '}
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
