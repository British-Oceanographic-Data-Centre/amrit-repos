import { IsString, MinLength, Matches } from 'class-validator';
export class PasswordResetConfirmDto {
  @IsString() token!: string;

  @MinLength(12)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
    { message: 'Weak password' })
  newPassword!: string;
}