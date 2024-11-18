import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            dateOfBirth: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            dateOfBirth: Yup.date().required('Date of Birth is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
        }),
        onSubmit: async (values) => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/v1/register', values, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/contacts');
                }, 1500);
            } catch (error) {
                toast.error(error.response?.data?.error || 'Something went wrong');
            }
        }
    });

    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            className={`w-full px-4 py-2 border rounded-md ${
                                formik.touched.name && formik.errors.name
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            className={`w-full px-4 py-2 border rounded-md ${
                                formik.touched.dateOfBirth && formik.errors.dateOfBirth
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formik.values.dateOfBirth}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.dateOfBirth}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            className={`w-full px-4 py-2 border rounded-md ${
                                formik.touched.email && formik.errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className={`w-full px-4 py-2 border rounded-md ${
                                formik.touched.password && formik.errors.password
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Register
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
