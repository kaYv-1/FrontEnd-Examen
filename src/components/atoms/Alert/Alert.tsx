import React from 'react'
import { Alert as AntAlert, AlertProps as AntAlertProps } from 'antd'

interface AlertProps extends AntAlertProps {}

export const Alert: React.FC<AlertProps> = (props) => {
  return <AntAlert {...props} />
}
