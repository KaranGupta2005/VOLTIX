'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { GradientMesh } from "@/components/ui/gradient-mesh";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    vehicleType: 'sedan',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    batteryCapacity: 50,
    registrationNumber: ''
  });

  // Generate unique registration number on component mount
  useEffect(() => {
    const generateRegNumber = () => {
      const states = ['MH', 'DL', 'KA', 'TN', 'WB'];
      const state = states[Math.floor(Math.random() * states.length)];
      const district = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
      const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));
      // Use timestamp to ensure uniqueness
      const timestamp = Date.now().toString().slice(-4);
      return `${state}${district}${series}${timestamp}`;
    };

    setFormData(prev => ({
      ...prev,
      registrationNumber: generateRegNumber()
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleYear' || name === 'batteryCapacity' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Frontend - Submitting signup with data:', formData);

    try {
      const result = await signup(formData);
      
      console.log('✅ Frontend - Signup result:', result);
      
      if (result.success) {
        // Redirect to email verification page
        router.push(`/verify-email?userId=${result.userId}`);
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('❌ Frontend - Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Header with Logo and Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <a href="/" aria-label="home" className="flex gap-2 items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Join EV Copilot</h1>
                <p className="text-gray-600 dark:text-gray-400">Create your account to get started with smart charging</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                        minLength={2}
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91XXXXXXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                        pattern="^\+91[6-9]\d{9}$"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Vehicle Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Make *</label>
                      <input
                        type="text"
                        name="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={handleChange}
                        placeholder="Tesla, Tata, Mahindra, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Model *</label>
                      <input
                        type="text"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleChange}
                        placeholder="Model 3, Nexon EV, XUV400, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Year *</label>
                      <input
                        type="number"
                        name="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={handleChange}
                        min="2015"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Capacity (kWh) *</label>
                      <input
                        type="number"
                        name="batteryCapacity"
                        value={formData.batteryCapacity}
                        onChange={handleChange}
                        min="10"
                        max="200"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number * (Auto-generated)</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white uppercase cursor-not-allowed"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated unique registration number</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle - Top Right with better visibility */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-1">
          <ModeToggle />
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <GradientMesh
          colors={["#bcecf6", "#00aaff", "#ffd447"]}
          distortion={8}
          swirl={0.2}
          speed={1}
          rotation={90}
          waveAmp={0.2}
          waveFreq={20}
          waveSpeed={0.2}
          grain={0.06}
        />
      </div>
    </div>
  );
}
