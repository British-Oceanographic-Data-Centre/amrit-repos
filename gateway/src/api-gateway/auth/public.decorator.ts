import { SetMetadata } from "@nestjs/common";

//Use @Public() decorator to allowed some route to not be 'guarded' by the JWT Guard.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata('isPublic', true)