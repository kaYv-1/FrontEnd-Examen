import React from 'react'
import { Empty } from 'antd'

interface EmptyStateProps {
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No hay datos'
}) => {
  return <Empty description={message} />
}
