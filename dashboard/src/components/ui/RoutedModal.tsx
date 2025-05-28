'use client';

import { useRouter } from 'next/navigation'
import Modal from './Modal'

const RoutedModal = ({children, backgroundTransparent=false} : {children: React.ReactNode, backgroundTransparent?:boolean}) => {
    
    const router = useRouter()

    const handleClose = () => {
        router.back()
    }

  return (
    <Modal isModalOpen={true} handleClose={handleClose} backgroundTransparent={backgroundTransparent}>{children}</Modal>
  )
}

export default RoutedModal