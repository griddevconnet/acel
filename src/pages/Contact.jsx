import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import FormSuccess from '../components/forms/FormSuccess.jsx'
import {
  TextField, TextAreaField, SelectField, CheckboxField, Honeypot, SubmitButton, FormError,
} from '../components/forms/FormFields.jsx'
import { useForm, isEmail } from '../lib/useForm.js'

const TOPICS = ['Membership', 'Certification', 'Partnerships', 'Media', 'Something else']

const validate = (v) => {
  const e = {}
  if (!v.fullName.trim()) e.fullName = 'Enter your name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
  if (!v.topic) e.topic = 'Choose what your message is about.'
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.'
  if (!v.consent) e.consent = 'Please agree so we can reply to you.'
  return e
}

export default function Contact() {
  const form = useForm({
    name: 'contact',
    initial: { fullName: '', email: '', organisation: '', topic: '', message: '', consent: false },
    validate,
  })
  const { bind, onSubmit, status, submitError, values, reset } = form

  return (
    <>
      <PageHeader
        title="Contact the Chamber"
        intro="Ask about membership, certification or partnerships. The Secretariat reads every message and replies by email."
      />

      <section className="section-light py-14 md:py-20">
        <div className="container-edge grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,20,45,0.25)] md:p-10">
              {status === 'success' ? (
                <FormSuccess
                  title="Message received"
                  onReset={reset}
                  resetLabel="Send another message"
                >
                  <p>
                    Thank you, {values.fullName.split(' ')[0]}. We&rsquo;ll reply to {values.email} once the
                    Secretariat has read your message.
                  </p>
                </FormSuccess>
              ) : (
                <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField label="Full name" required autoComplete="name" {...bind('fullName')} />
                    <TextField label="Email address" type="email" required autoComplete="email" {...bind('email')} />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField label="Organisation" autoComplete="organization" {...bind('organisation')} />
                    <SelectField label="Topic" required options={TOPICS} placeholder="Choose a topic" {...bind('topic')} />
                  </div>
                  <TextAreaField label="Message" required rows={6} {...bind('message')} />
                  <CheckboxField {...bind('consent')} checked={values.consent}>
                    I agree that ACEL may use these details to reply to my message, as described in the{' '}
                    <Link to="/privacy" className="text-emerald underline underline-offset-2">privacy policy</Link>.
                  </CheckboxField>
                  <Honeypot value={values._gotcha} onChange={bind('_gotcha').onChange} />
                  {status === 'error' && <FormError message={submitError} />}
                  <div>
                    <SubmitButton busy={status === 'submitting'}>Send message</SubmitButton>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="order-2 lg:order-1 lg:col-span-4">
            <h2 className="font-display text-[1.35rem] leading-snug text-ink">Looking for something specific?</h2>
            <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10 text-[15px]">
              <li className="py-4">
                <Link to="/membership" className="font-medium text-emerald hover:text-emerald-deep">Membership</Link>
                <p className="mt-1 text-ink/65">Streams, tiers, grades and how applying works.</p>
              </li>
              <li className="py-4">
                <Link to="/certification" className="font-medium text-emerald hover:text-emerald-deep">Certification</Link>
                <p className="mt-1 text-ink/65">The three levels, and how to register.</p>
              </li>
              <li className="py-4">
                <Link to="/governance" className="font-medium text-emerald hover:text-emerald-deep">Governance</Link>
                <p className="mt-1 text-ink/65">How the Chamber is run and held to account.</p>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
