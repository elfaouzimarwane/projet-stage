import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import regionsData from '../data/regionsData.json';
import { FaPhone, FaUser, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';

const VisiteurForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    ppr: '',
    phone: '',
    region: '',
    province: '',
    commune: '',
    customProvince: '', // Nouveau champ pour la province personnalisée
    customCommune: '',  // Nouveau champ pour la commune personnalisée
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [showCustomFields, setShowCustomFields] = useState(false); // État pour afficher les champs personnalisés

  useEffect(() => {
    if (formData.region) {
      setProvinces(Object.keys(regionsData[formData.region]));
      setCommunes([]);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province) {
      setCommunes(regionsData[formData.region][formData.province]);
    }
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleCustomFields = () => {
    setShowCustomFields(!showCustomFields);
    if (!showCustomFields) {
      setFormData({ ...formData, customProvince: '', customCommune: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const dataToSend = {
      ...formData,
      province: showCustomFields && formData.customProvince ? formData.customProvince : formData.province,
      commune: showCustomFields && formData.customCommune ? formData.customCommune : formData.commune,
    };

    const cinRegex = /^[A-Za-z]{1,2}\d{3,6}$/;
    if (formData.cin && !cinRegex.test(formData.cin)) {
      setError('CIN invalide. Il doit commencer par une ou deux lettres et se terminer par des chiffres, pour un total de 6 caractères.');
      toast.error('CIN invalide. Il doit commencer par une ou deux lettres et se terminer par des chiffres, pour un total de 6 caractères.');
      setLoading(false);
      return;
    }
    const pprRegex = /^\d+$/;
    if (formData.ppr && !pprRegex.test(formData.ppr)) {
      setError('PPR invalide. Il doit uniquement contenir des chiffres.');
      toast.error('PPR invalide. Il doit uniquement contenir des chiffres.');
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
        body: JSON.stringify({ visitorData: dataToSend, visitorType: 'NonAdherent' }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setSuccess('Visiteur ajouté avec succès');
        toast.success('Visiteur ajouté avec succès');
        setFormData({
          nom: '',
          prenom: '',
          cin: '',
          ppr: '',
          phone: '',
          region: '',
          province: '',
          commune: '',
          customProvince: '', // Nouveau champ pour la province personnalisée
          customCommune: '',  // Nouveau champ pour la commune personnalisée
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
          <h2 className="text-2xl font-bold mb-8 text-center">Formulaire Visiteur</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Nom</label>
                </div>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le nom"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Prénom</label>
                </div>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le prénom"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
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
              <div>
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">PPR</label>
                </div>
                <input
                  type="text"
                  name="ppr"
                  value={formData.ppr}
                  onChange={handleChange}
                  className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le PPR"
                />
              </div>
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
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Région</label>
                </div>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une région</option>
                  {Object.keys(regionsData).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Province</label>
                </div>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.region || showCustomFields}
                >
                  <option value="">Sélectionnez une province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <label className="block text-gray-700 mb-1">Commune</label>
                </div>
                <select
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.province || showCustomFields}
                >
                  <option value="">Sélectionnez une commune</option>
                  {communes.map((commune) => (
                    <option key={commune} value={commune}>{commune}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={toggleCustomFields}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
              >
                {showCustomFields ? 'Annuler' : 'Autre'}
              </button>
            </div>
            {showCustomFields && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <label className="block text-gray-700 mb-1">Nouvelle Province</label>
                  </div>
                  <input
                    type="text"
                    name="customProvince"
                    value={formData.customProvince}
                    onChange={handleChange}
                    className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez une nouvelle province"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <label className="block text-gray-700 mb-1">Nouvelle Commune</label>
                  </div>
                  <input
                    type="text"
                    name="customCommune"
                    value={formData.customCommune}
                    onChange={handleChange}
                    className="mt-1 p-3 bg-gray-50 border rounded w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez une nouvelle commune"
                  />
                </div>
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

export default VisiteurForm;
