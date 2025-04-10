import LoginForm from '@/components/login/LoginForm'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: 'OceanBoards - Login',
    description: 'AMRIT OceanBoards login form',
    icons: {
      icon: '/favicon.png',
    },
  };

const Login = () => {
  return (
    <LoginForm />
  )
}

export default Login