import type { InputHTMLAttributes, ReactNode } from 'react'

import './form-field.css'

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  helperText?: string
}

export function CheckboxField({ id, label, helperText, className = '', ...props }: CheckboxFieldProps) {
  const fieldId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : 'checkbox-field')

  return (
    <label className={['sc-checkbox', className].filter(Boolean).join(' ')} htmlFor={fieldId}>
      <span className="sc-checkbox__control">
        <input id={fieldId} type="checkbox" className="sc-checkbox__input" {...props} />
      </span>
      <span className="sc-checkbox__content">
        <span className="sc-checkbox__label">{label}</span>
        {helperText ? <span className="sc-checkbox__help">{helperText}</span> : null}
      </span>
    </label>
  )
}
