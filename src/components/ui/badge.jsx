import React from 'react'

export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'badge-primary',
    secondary: 'badge-primary',
    outline: 'badge-outline'
  }
  
  const classes = `badge ${variantClasses[variant]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}