import React from 'react'
import { Input as AntInput, InputProps as AntInputProps } from 'antd'

interface InputProps extends AntInputProps {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  ...props 
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>{label}</label>}
      <AntInput {...props} status={error ? 'error' : undefined} />
      {error && <span style={{ color: '#ff4d4f', fontSize: '12px' }}>{error}</span>}
    </div>
  )
}
