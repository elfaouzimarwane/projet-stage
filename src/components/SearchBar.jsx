import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const SearchBar = ({ setSearchResults, setError }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
      setError('');
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError('');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length === 0) {
        setError('Aucun résultat trouvé.');
        toast.error('Aucun résultat trouvé.', { id: 'search-error' });
      } else {
        setError('');
        setSearchResults(response.data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des résultats de recherche:', err);
      setError('Erreur lors de la récupération des résultats de recherche.');
      toast.error('Erreur lors de la récupération des résultats de recherche.', { id: 'search-error' });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 mt-4">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg flex items-center border border-gray-300 rounded-full bg-white shadow-lg px-4 py-2 mt-4 relative">
          <span className="absolute left-7 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            placeholder="Rechercher un visiteur..."
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none">
            Rechercher
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
