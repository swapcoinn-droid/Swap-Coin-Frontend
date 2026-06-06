import type { InputHTMLAttributes, ReactNode } from 'react'

import './form-field.css'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helperText?: string
  errorText?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function TextField({
  id,
  label,
  helperText,
  errorText,
  className = '',
  leadingIcon,
  trailingIcon,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const descriptionId = helperText || errorText ? `${fieldId}-description` : undefined

  return (
    <label className={['sc-field', className].filter(Boolean).join(' ')} htmlFor={fieldId}>
      <span className="sc-field__label">{label}</span>
      <span className="sc-field__control">
        {leadingIcon ? <span className="sc-field__icon">{leadingIcon}</span> : null}
        <input
          id={fieldId}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText) || undefined}
          className="sc-field__input"
          {...props}
        />
        {trailingIcon ? <span className="sc-field__icon sc-field__icon--trailing">{trailingIcon}</span> : null}
      </span>
      {helperText || errorText ? (
        <span className={['sc-field__help', errorText ? 'is-error' : ''].filter(Boolean).join(' ')} id={descriptionId}>
          {errorText ?? helperText}
        </span>
      ) : null}
    </label>
  )
}