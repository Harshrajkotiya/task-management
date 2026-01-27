import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthLayout from '../components/common/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
        <p className="text-gray-400 text-sm">
          Log in to manage your tasks and track progress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button type="button" className="text-[10px] text-red-400 hover:text-red-500 font-medium">
              Forgot your password?
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-xs text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#5D5CDE] hover:underline font-semibold">
          Sign up
        </Link>
      </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
