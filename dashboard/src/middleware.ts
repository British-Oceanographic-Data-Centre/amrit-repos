import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./app/_lib/session";

const protectedRoutes = ["/alerts/my-subscriptions"]
const publicRoutes = ["/login"];

// Here could be added role check and authorize route for user based on thier roles
export default async function middleware (req : NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const session = await  verifySession();

    if (isProtectedRoute && !session?.isAuth ) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session?.isAuth ) {
        return NextResponse.redirect (new URL("/", req.nextUrl))
    }

    return NextResponse.next();

}