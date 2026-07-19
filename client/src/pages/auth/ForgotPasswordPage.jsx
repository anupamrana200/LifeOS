import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthCard, AuthFooter, AuthHeader, AuthInput, SubmitButton } from '@/components/auth';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { applyApiFieldErrors, getApiErrorMessage } from '@/utils';

export const ForgotPasswordPage = () => {
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm({
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
      toast.success('If an account exists, a reset link has been sent.');
    } catch (error) {
      applyApiFieldErrors(error, setError);
      toast.error(getApiErrorMessage(error, 'We could not send the reset link.'));
    }
  };

  return (
    <AuthCard>
      <AuthHeader description="Enter your email and we’ll send a secure password-reset link." title="Reset your password" />
      <form className="space-y-gutter" noValidate onSubmit={handleSubmit(onSubmit)}>
        <AuthInput autoComplete="email" error={errors.email} label="Email address" placeholder="you@example.com" type="email" {...register('email', {
          required: 'Email is required.',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
        })} />
        <SubmitButton isLoading={isSubmitting}>Send reset link</SubmitButton>
      </form>
      <AuthFooter>
        Remembered it? <Link className="font-semibold text-primary hover:opacity-80" to={ROUTES.signIn}>Back to sign in</Link>
      </AuthFooter>
    </AuthCard>
  );
};
