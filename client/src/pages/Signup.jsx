import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthLayout from '../components/common/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import RoleCard from '../components/common/RoleCard';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleSignup = async (role) => {
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.username, role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === 1 ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-400 text-sm">
              Get started with task management in seconds.
            </p>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            <Input
              label="Full name"
              name="username"
              placeholder="Enter your full name"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />

            <div className="pt-2">
              <Button type="submit">Create Account</Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#5D5CDE] hover:underline font-semibold"
            >
              Log in
            </Link>
          </div>
        </>
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Choose Your Role
            </h1>
            <p className="text-gray-400 text-xs text-center max-w-xs mx-auto">
              Select how you want to use the dashboard. You can't change this
              later without admin support.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <RoleCard
              variant="admin"
              title="Admin"
              description="Create, assign, and manage tasks across all users."
              features={[
                'Create, edit, and delete tasks',
                'Assign tasks to users',
                'View all tasks and users',
              ]}
              buttonText={
                loading && formData.role === 'admin'
                  ? 'Signing up...'
                  : 'Continue as Admin'
              }
              onSelect={() => handleSignup('admin')}
              disabled={loading}
            />

            <RoleCard
              variant="user"
              title="User"
              description="View and manage tasks assigned to you."
              features={[
                'View assigned tasks',
                'Update task status',
                'Track your progress',
              ]}
              buttonText={
                loading && formData.role === 'user'
                  ? 'Signing up...'
                  : 'Continue as User'
              }
              onSelect={() => handleSignup('user')}
              disabled={loading}
            />
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              Go back
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Signup;
