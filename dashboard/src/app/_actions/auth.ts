"use server";

import { AUTHSERVICE_API_BASE_URL } from '@/config/api-routes';
import { createSession, deleteSession } from '@/app/_lib/session';
import { z } from 'zod'
import { redirect } from 'next/navigation';

const schema = z.object({
    // login: z.string().email({message: "Invalid email address"}).trim(),   
   login: z.string().trim(),
   password: z.string().min(6, {message: "Password must be at least 6 characters"})

  })

export async function login(prevState: any, formData: FormData){
    // controling email / password format
    const result = schema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    // Call to auth service :
    const {login, password} = result.data;
    const res = await fetch(`${AUTHSERVICE_API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        headers: {
          'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            // invalid credentials ? 
            return  {
                errors : {
                    login: ["Invalid email or password"],
                }
            }
        } else {
            return  {
                errors : {
                    login: ["Error during authentication"],
                }
            }
        }
    }

    // Get the access_token from the response :
    const {access_token_rs256, expires_in} = await res.json();

    // save the token in a secure Http-Only cookie (server side):
    await createSession(access_token_rs256,expires_in );  

    return {
        success: true
    }

}

export async function logout() {
    await deleteSession();     
    
    redirect('/');
}