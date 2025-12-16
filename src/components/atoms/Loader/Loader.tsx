import React from 'react'
import { Spin } from 'antd'

interface LoaderProps {
  loading: boolean
  size?: 'small' | 'default' | 'large'
}

export const Loader: React.FC<LoaderProps> = ({ loading, size = 'default' }) => {
  if (!loading) return null
  return <Spin size={size} />
}
