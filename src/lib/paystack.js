// Frontend-only Paystack integration.
//
// This opens Paystack's hosted Inline popup and resolves with the reference
// from its client-side callback. That is enough to demo the payment step
// end-to-end, but it is NOT enough for production: a client-side callback
// can be forged, so before going live, add a backend endpoint that calls
// Paystack's Verify Transaction API (GET /transaction/verify/:reference)
// with the secret key, and only treat a registration/application as paid
// once that server-side check passes. Wire that verification call into
// `payWithPaystack`'s onSuccess handling below when the backend exists.
//
// Until VITE_PAYSTACK_PUBLIC_KEY is set to a real key, payments are
// simulated (like the demo mode in submitForm.js) so the flow can be shown
// to the client before Paystack is fully wired up.

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export const paystackDemoMode = !PUBLIC_KEY

let scriptPromise = null

function loadPaystackScript() {
  if (window.PaystackPop) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load the payment provider. Check your connection and try again.'))
    document.body.appendChild(script)
  })
  return scriptPromise
}

/**
 * Open the Paystack popup (or simulate it in demo mode).
 * amountUsd is a plain dollar amount, e.g. 250 for $250 — converted to the
 * minor unit Paystack expects internally.
 * Returns a promise that resolves with { reference, demo? } on success and
 * rejects if the payment is cancelled or fails.
 */
export function payWithPaystack({ email, amountUsd, currency = 'USD', reference, metadata = {} }) {
  const ref = reference || `ACEL-${Date.now()}`

  if (paystackDemoMode) {
    // No key configured yet: simulate a successful payment so the rest of
    // the flow (and the client demo) can proceed.
    console.info('[demo] Paystack payment simulated (no VITE_PAYSTACK_PUBLIC_KEY set):', {
      email, amountUsd, currency, reference: ref, metadata,
    })
    return new Promise((resolve) => {
      setTimeout(() => resolve({ reference: ref, demo: true }), 900)
    })
  }

  return loadPaystackScript().then(
    () =>
      new Promise((resolve, reject) => {
        const handler = window.PaystackPop.setup({
          key: PUBLIC_KEY,
          email,
          amount: Math.round(amountUsd * 100),
          currency,
          ref,
          metadata,
          callback: (response) => resolve({ reference: response.reference }),
          onClose: () => reject(new Error('Payment was not completed. You can try again when ready.')),
        })
        handler.openIframe()
      }),
  )
}
