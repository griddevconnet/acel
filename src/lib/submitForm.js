// Single place every form on the site sends its data.
//
// Until there is a backend, point VITE_FORM_ENDPOINT at a form service
// (e.g. a Formspree form URL) and submissions are emailed to the Secretariat
// for manual review. When a real API exists, only this file needs to change.
//
// In development, or when VITE_FORM_DEMO=true, a missing endpoint is treated
// as a successful demo submission (logged to the console). In production with
// no endpoint the form shows an error rather than silently dropping data.

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const DEMO = import.meta.env.DEV || import.meta.env.VITE_FORM_DEMO === 'true'

export async function submitForm(formName, data) {
  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (data._gotcha) return { ok: true }

  const payload = { form: formName, ...data }
  delete payload._gotcha

  if (!ENDPOINT) {
    if (DEMO) {
      console.info(`[demo] "${formName}" form submitted (no endpoint set):`, payload)
      await new Promise((resolve) => setTimeout(resolve, 700))
      return { ok: true, demo: true }
    }
    throw new Error('This form is not connected yet. Please try again later.')
  }

  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('We could not reach the server. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error('Something went wrong sending your details. Please try again.')
  }
  return { ok: true }
}
