import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhone, FaBuilding, FaClipboard } from 'react-icons/fa';

const PartenaireForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    partnershipType: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "partnershipType") {
      setShowOtherInput(value === "autre");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const dataToSend = {
      ...formData,
      partnershipType: formData.partnershipType === "autre" ? formData.otherPartnershipType : formData.partnershipType,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/add-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visitorData: dataToSend, visitorType: 'Partenaire' }),
      });
      if (response.ok) {
        setSuccess('Visiteur ajouté avec succès');
        toast.success('Visiteur ajouté avec succès');
        setFormData({
          companyName: '',
          phone: '',
          partnershipType: '',
          otherPartnershipType: '', // Reset the "Autre" input
        });
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Erreur lors de l\'ajout du visiteur');
        toast.error('Erreur lors de l\'ajout du visiteur');
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
          <h2 className="text-2xl font-bold mb-8 text-center">Formulaire Partenaire</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-blue-500" />
                <label className="block text-gray-700 mb-1">Nom de l’entreprise/organisme</label>
              </div>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l’entreprise ou organisme"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-500" />
                <label className="block text-gray-700 mb-1">Téléphone</label>
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Exemple : 0612345678"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaClipboard className="text-blue-500" />
                <label className="block text-gray-700 mb-1">Type de partenariat</label>
              </div>
              <select
                name="partnershipType"
                value={formData.partnershipType}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez le type de partenariat</option>
                <option value="sponsorship">Sponsoring</option>
                <option value="collaboration">Collaboration</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {showOtherInput && (
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <FaClipboard className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Précisez le type de partenariat</label>
                </div>
                <input
                  type="text"
                  name="otherPartnershipType"
                  value={formData.otherPartnershipType || ""}
                  onChange={handleChange}
                  className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le type de partenariat"
                />
              </div>
            )}

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

export default PartenaireForm;
