import { Button, CircularProgress } from '@mui/material'
import React from 'react'
//import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
    children:React.ReactNode;
    pending : boolean
    fullwidth?:boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

// May be reusable in different form ? if not move to /components/login
const SubmitButton = ({children, pending, fullwidth=true, onClick} :SubmitButtonProps ) => {

    // pending from useFormStatus not working because of a React bug : https://github.com/facebook/react/issues/30368 
    // Using a props instead.
    //const {pending} = useFormStatus(); 

    return (
        <Button
            type="submit"
            fullWidth={fullwidth}
            variant="contained"
            disabled={pending}
            startIcon={pending ? <CircularProgress size={20} /> : null}
            onClick={onClick}              
        >
            {children}
        </Button>
    )
}

export default SubmitButton