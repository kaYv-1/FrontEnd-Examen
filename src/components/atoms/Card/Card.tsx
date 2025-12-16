import React from 'react'
import { Card as AntCard, CardProps as AntCardProps } from 'antd'

interface CardProps extends AntCardProps {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <AntCard {...props}>
      {children}
    </AntCard>
  )
}
