import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthCard, AuthFooter, AuthHeader, AuthInput, PasswordInput, SubmitButton } from '@/components/auth';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { applyApiFieldErrors, getApiErrorMessage } from '@/utils';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, signIn } = useAuth();
  const { formState: { errors }, handleSubmit, register, setError } = useForm({
    defaultValues: { email: '', password: '', rememberMe: true },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      await signIn(values);
      toast.success('Welcome back to LifeOS.');
      navigate(location.state?.from?.pathname || ROUTES.dashboard, { replace: true });
    } catch (error) {
      applyApiFieldErrors(error, setError);
      toast.error(getApiErrorMessage(error, 'We could not sign you in.'));
    }
  };

  return (
    <AuthCard>
      <AuthHeader description="Sign in to continue to your second brain." title="Welcome back" />
      <form className="space-y-gutter" noValidate onSubmit={handleSubmit(onSubmit)}>
        <AuthInput autoComplete="email" error={errors.email} label="Email address" placeholder="you@example.com" type="email" {...register('email', {
          required: 'Email is required.',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
        })} />
        <PasswordInput autoComplete="current-password" error={errors.password} label="Password" placeholder="Enter your password" {...register('password', { required: 'Password is required.' })} />
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-content-secondary">
            <input className="size-4 rounded border-border accent-primary" type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <Link className="font-medium text-primary hover:opacity-80" to={ROUTES.forgotPassword}>Forgot password?</Link>
        </div>
        <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
      </form>
      <AuthFooter>
        New to LifeOS? <Link className="font-semibold text-primary hover:opacity-80" to={ROUTES.signUp}>Create an account</Link>
      </AuthFooter>
    </AuthCard>
  );
};
