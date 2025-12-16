import React from 'react'
import { Form, FormProps } from 'antd'
import { Input as AntInputPassword } from 'antd'
import { Button, Input } from '@/components/atoms'

interface LoginFormProps extends Omit<FormProps, 'children'> {
  onSubmit: (values: { email: string; password: string }) => void
  loading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading = false,
  ...props 
}) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: { email: string; password: string }) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      {...props}
    >
      <Form.Item
        name="email"
        label="Correo electrónico (solo Gmail)"
        rules={[
          { required: true, message: 'Por favor ingresa tu correo electrónico' },
          { type: 'email', message: 'Por favor ingresa un correo válido' },
          {
            validator: async (_, value) => {
              if (!value) return Promise.resolve()
              return value.toLowerCase().endsWith('@gmail.com')
                ? Promise.resolve()
                : Promise.reject(new Error('El email debe terminar en @gmail.com'))
            },
          },
        ]}
      >
        <Input placeholder="tucuenta@gmail.com" type="email" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[
          { required: true, message: 'Por favor ingresa tu contraseña' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
        ]}
      >
        <AntInputPassword placeholder="••••••" />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </Form>
  )
}
