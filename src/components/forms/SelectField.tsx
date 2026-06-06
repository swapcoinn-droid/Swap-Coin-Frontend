import type { SelectHTMLAttributes, ReactNode } from 'react'

import './form-field.css'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  helperText?: string
  errorText?: string
  leadingIcon?: ReactNode
}

export function SelectField({
  id,
  label,
  helperText,
  errorText,
  className = '',
  leadingIcon,
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const descriptionId = helperText || errorText ? `${fieldId}-description` : undefined

  return (
    <label className={['sc-field', className].filter(Boolean).join(' ')} htmlFor={fieldId}>
      <span className="sc-field__label">{label}</span>
      <span className="sc-field__control">
        {leadingIcon ? <span className="sc-field__icon">{leadingIcon}</span> : null}
        <select
          id={fieldId}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText) || undefined}
          className="sc-field__input sc-field__input--select"
          {...props}
        >
          {children}
        </select>
      </span>
      {helperText || errorText ? (
        <span className={['sc-field__help', errorText ? 'is-error' : ''].filter(Boolean).join(' ')} id={descriptionId}>
          {errorText ?? helperText}
        </span>
      ) : null}
    </label>
  )
}