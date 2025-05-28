
import LoginForm from '@/components/login/LoginForm'
import RoutedModal from '@/components/ui/RoutedModal'
import React from 'react'

const Login = () => {
  return (
    <RoutedModal backgroundTransparent={true}>
        <LoginForm />
    </RoutedModal>
  )
}

export default Login