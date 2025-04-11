'use client';
import React, { useActionState, useEffect } from 'react'
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { Box, Button, Divider, FormControl, FormLabel, Link, TextField, Typography } from '@mui/material';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon } from '../ui/CustomIcons';
import GitHubIcon from '@mui/icons-material/GitHub';
import { login } from '../../app/_actions/auth';
import SubmitButton from '../SubmitButton';
import { useRouter } from 'next/navigation';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '450px',
    },
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
      boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
  }));

  const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      
    },
  }));

const LoginForm = () => {
    const [openForgetPassword, setOpenForgetPassword,] = React.useState(false);
    const [state, loginAction, isPending] = useActionState(login, undefined);
    const router = useRouter()

    useEffect(() => {
        if (!isPending && state?.success) {
          router.back();    // To go back to current page after successful login   
        }
      }, [isPending, state]);
    
    const handleClickOpenForgetPassword = () => {
        setOpenForgetPassword(true);
    };
    
    const handleCloseForgetPassword  = () => {
        setOpenForgetPassword(false);
    };

    

  return (
    <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
        <Box component="img"
          src="/favicon.png"
          alt="AMRIT logo"
          sx={{
            height: 96,
            width: 96,
            mb: 2,

          }}
        />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            action={loginAction}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={state?.errors?.login ? true : false}
                helperText={state?.errors?.login}
                id="login"
                type="email"
                name="login"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={state?.errors?.login  ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={state?.errors?.password ? true : false}
                helperText={state?.errors?.password}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={state?.errors?.password ? 'error' : 'primary'}
              />
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <ForgotPassword open={openForgetPassword} handleClose={handleCloseForgetPassword} />
            <SubmitButton>Sign in</SubmitButton>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpenForgetPassword}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Github')}
              startIcon={<GitHubIcon />}
            >
              Sign in with Github
            </Button>            
          </Box>
        </Card>
      </SignInContainer>
  )
}

export default LoginForm