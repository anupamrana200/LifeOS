import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, AuthFooter, AuthHeader, AuthInput, PasswordInput, SubmitButton } from '@/components/auth';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { applyApiFieldErrors, getApiErrorMessage, isStrongPassword } from '@/utils';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError, watch } = useForm({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const password = watch('password');

  const onSubmit = async ({ confirmPassword: _confirmPassword, ...values }) => {
    try {
      await authService.register(values);
      toast.success('Your account has been created. Please sign in.');
      navigate(ROUTES.signIn, { replace: true });
    } catch (error) {
      applyApiFieldErrors(error, setError);
      toast.error(getApiErrorMessage(error, 'We could not create your account.'));
    }
  };

  return (
    <AuthCard>
      <AuthHeader description="Create a secure home for your ideas and knowledge." title="Create your account" />
      <form className="space-y-gutter" noValidate onSubmit={handleSubmit(onSubmit)}>
        <AuthInput autoComplete="name" error={errors.fullName} label="Full name" placeholder="Your full name" {...register('fullName', {
          required: 'Full name is required.',
          minLength: { value: 2, message: 'Full name must be at least 2 characters.' },
        })} />
        <AuthInput autoComplete="email" error={errors.email} label="Email address" placeholder="you@example.com" type="email" {...register('email', {
          required: 'Email is required.',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
        })} />
        <PasswordInput autoComplete="new-password" error={errors.password} label="Password" placeholder="Create a strong password" showStrength value={password} {...register('password', {
          required: 'Password is required.',
          validate: (value) => isStrongPassword(value) || 'Use all password requirements below.',
        })} />
        <PasswordInput autoComplete="new-password" error={errors.confirmPassword} label="Confirm password" placeholder="Re-enter your password" {...register('confirmPassword', {
          required: 'Please confirm your password.',
          validate: (value) => value === password || 'Passwords do not match.',
        })} />
        <SubmitButton isLoading={isSubmitting}>Create account</SubmitButton>
      </form>
      <AuthFooter>
        Already have an account? <Link className="font-semibold text-primary hover:opacity-80" to={ROUTES.signIn}>Sign in</Link>
      </AuthFooter>
    </AuthCard>
  );
};
