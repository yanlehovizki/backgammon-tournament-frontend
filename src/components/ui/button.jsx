import React from 'react'

export const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseClasses = 'btn'
  const variantClasses = {
    default: 'btn-primary',
    outline: 'btn-outline',
    secondary: 'btn-secondary'
  }
  const sizeClasses = {
    default: '',
    sm: 'btn-sm'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}