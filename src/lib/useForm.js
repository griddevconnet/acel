import { useState } from 'react'
import { submitForm } from './submitForm.js'

// Small form state machine shared by every form.
// validate(values) returns an object of { fieldName: 'message' } (empty = valid).
// beforeSubmit(values), if provided, runs after validation passes and before
// the form is actually submitted — its resolved value (an object) is merged
// into the submitted payload. If it rejects, the form shows that error and
// does not submit (used for the Paystack payment step; see paystack.js).
export function useForm({ name, initial, validate, beforeSubmit }) {
  const [values, setValues] = useState({ ...initial, _gotcha: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')

  const bind = (field) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (e) => {
      const { type, checked, value } = e.target
      setValues((prev) => ({ ...prev, [field]: type === 'checkbox' ? checked : value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    },
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first field that needs attention.
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"]')?.focus()
      })
      return
    }
    setStatus('submitting')
    setSubmitError('')
    try {
      const extra = beforeSubmit ? await beforeSubmit(values) : undefined
      await submitForm(name, { ...values, ...extra })
      setStatus('success')
    } catch (err) {
      setSubmitError(err.message)
      setStatus('error')
    }
  }

  const reset = () => {
    setValues({ ...initial, _gotcha: '' })
    setErrors({})
    setStatus('idle')
    setSubmitError('')
  }

  return { values, bind, onSubmit, reset, status, submitError }
}

// Shared validators
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
