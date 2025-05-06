import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateAccount = ({ onCreateAccount }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 'Faible';
    if (password.length >= 8) {
      strength = 'Moyen';
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength = 'Fort';
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/create-user', {
        username: formData.username,
        password: formData.password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess(response.data.message);
      setIsAccountCreated(true);
      toast.success(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
      toast.error(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Créer un compte</h2>
        <div className="flex justify-center">
          <div className="relative w-1/2">
            <label htmlFor="username" className="block text-gray-700 mb-2 text-center">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
            <div className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400">
              <FaUser />
            </div>
          </div>
        </div>
        <Transition
          show={!isAccountCreated}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Password Input */}
              <div className="relative col-span-1">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <p className="text-sm mt-2">Sécurité du mot de passe: {passwordStrength}</p>
              </div>

              {/* Confirm Password Input */}
              <div className="relative col-span-1">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                  Confirmez le mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <FaLock className="absolute left-3 top-[52%] transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                {isLoading ? 'Création du compte...' : 'Créer un compte'}
              </button>
            </div>
          </form>
        </Transition>
      </div>
    </div>
  );
};

export default CreateAccount;
