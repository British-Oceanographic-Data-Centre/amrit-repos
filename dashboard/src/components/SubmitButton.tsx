import { Button } from '@mui/material'
import React from 'react'
import { useFormStatus } from 'react-dom';

// May be reusable in different form ? if not move to /components/login
const SubmitButton = ({children} : {children: React.ReactNode}) => {

    const {pending} = useFormStatus();

    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={pending}              
        >
            {children}
        </Button>
    )
}

export default SubmitButton