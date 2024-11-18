import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/v1/login', values);
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Something went wrong';
        toast.error(errorMessage);
        console.error('Login error:', error); // Log the full error for debugging
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login to Your Account</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-indigo-300 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-indigo-300 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
