import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaIdCard, FaUser, FaClipboard } from 'react-icons/fa';

const AdherentForm = () => {
  const [formData, setFormData] = useState({
    adherentNumber: '',
    cin: '',
    visitReason: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const cinRegex = /^[A-Za-z]{1,2}\d{5,6}$/;
    if (formData.cin && !cinRegex.test(formData.cin)) {
      setError('CIN invalide. Il doit commencer par une ou deux lettres et se terminer par des chiffres, pour un total de 6 caractères.');
      toast.error('CIN invalide. Il doit commencer par une ou deux lettres et se terminer par des chiffres, pour un total de 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/add-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visitorData: formData, visitorType: 'Adherent' }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setSuccess('Visiteur ajouté avec succès');
        toast.success('Visiteur ajouté avec succès');
        setFormData({
          adherentNumber: '',
          cin: '',
          visitReason: '',
        });
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(responseData.error);
        toast.error(responseData.error);
      }
    } catch (error) {
      setError('Une erreur inattendue s\'est produite');
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Toaster />
      <div className="mt-24 p-6 bg-gray-50 rounded-lg mx-auto" style={{ width: '800px' }}>
        <div className="shadow-xl p-8 rounded-2xl bg-white">
          <div className="text-center mb-8">
            <img src="/img/image-removebg-preview.png" alt="Logo" className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-8 text-center">Formulaire Adhérent</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <FaIdCard className="text-blue-500" />
                <label className="block text-gray-700 mb-1">Numéro d'adhérent</label>
              </div>
              <input
                type="text"
                name="adherentNumber"
                value={formData.adherentNumber}
                onChange={handleChange}
                className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le numéro d'adhérent"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-500" />
                <label className="block text-gray-700 mb-1">CIN</label>
              </div>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Exemple : AB12345"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaClipboard className="text-blue-500" />
                <label className="block text-gray-700 mb-1">Motif de la visite</label>
              </div>
              <input
                type="text"
                name="visitReason"
                value={formData.visitReason}
                onChange={handleChange}
                className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Indiquez le motif de la visite"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Ajouter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdherentForm;
