import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { LogIn } from 'lucide-react';
import { mockCredentials } from '../../data/data';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  const handleLogin = (values, { setFieldError }) => {
    const validCredential = mockCredentials.find(
      (cred) => cred.email === values.email && cred.password === values.password
    );

    if (validCredential) {
      const user = users.find((u) => u.email === values.email);
      if (user) {
        dispatch(login(user));
      }
    } else {
      setFieldError('password', 'Invalid email or password');
    }
    
    console.log('Login attempt:', values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Sign in to your account
          </p>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                  <ErrorMessage 
                    name="email" 
                    component="p" 
                    className="mt-1 text-sm text-red-600 dark:text-red-400" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                  <ErrorMessage 
                    name="password" 
                    component="p" 
                    className="mt-1 text-sm text-red-600 dark:text-red-400" 
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">alice@example.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>PM:</span>
                <span className="font-mono">bob@example.com / manager123</span>
              </div>
              <div className="flex justify-between">
                <span>Dev:</span>
                <span className="font-mono">charlie@example.com / dev123</span>
              </div>
              <div className="flex justify-between">
                <span>Viewer:</span>
                <span className="font-mono">eve@example.com / viewer123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}