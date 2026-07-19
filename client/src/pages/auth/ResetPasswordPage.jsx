import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthCard, AuthFooter, AuthHeader, PasswordInput, SubmitButton } from '@/components/auth';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { applyApiFieldErrors, getApiErrorMessage, isStrongPassword } from '@/utils';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError, watch } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const password = watch('password');

  const onSubmit = async ({ confirmPassword: _confirmPassword, password: nextPassword }) => {
    try {
      await authService.resetPassword(token, { password: nextPassword });
      toast.success('Your password has been reset. Please sign in.');
      navigate(ROUTES.signIn, { replace: true });
    } catch (error) {
      applyApiFieldErrors(error, setError);
      toast.error(getApiErrorMessage(error, 'This reset link is invalid or expired.'));
    }
  };

  if (!token) {
    return <Navigate replace to={ROUTES.invalidToken} />;
  }

  return (
    <AuthCard>
      <AuthHeader description="Choose a new password you have not used elsewhere." title="Set a new password" />
      <form className="space-y-gutter" noValidate onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput autoComplete="new-password" error={errors.password} label="New password" placeholder="Create a strong password" showStrength value={password} {...register('password', {
          required: 'Password is required.',
          validate: (value) => isStrongPassword(value) || 'Use all password requirements below.',
        })} />
        <PasswordInput autoComplete="new-password" error={errors.confirmPassword} label="Confirm new password" placeholder="Re-enter your new password" {...register('confirmPassword', {
          required: 'Please confirm your password.',
          validate: (value) => value === password || 'Passwords do not match.',
        })} />
        <SubmitButton isLoading={isSubmitting}>Reset password</SubmitButton>
      </form>
      <AuthFooter>
        <Link className="font-semibold text-primary hover:opacity-80" to={ROUTES.signIn}>Back to sign in</Link>
      </AuthFooter>
    </AuthCard>
  );
};
