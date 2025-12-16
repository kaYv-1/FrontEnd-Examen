import React from 'react'
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd'

interface ButtonProps extends AntButtonProps {
  label?: string
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  label, 
  ...props 
}) => {
  return (
    <AntButton {...props}>
      {label || children}
    </AntButton>
  )
}
