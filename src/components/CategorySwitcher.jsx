import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = ['Adherent', 'Visiteur', 'Partenaire'];

const CategorySwitcher = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedPages = useRef(new Set());
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchedPages.current.clear();
    fetchData(categories[currentCategory], 1);
  }, [currentCategory]);

  const fetchData = async (category, page) => {
    if (fetchedPages.current.has(page)) return;
    fetchedPages.current.add(page);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      let response;
      switch (category) {
        case 'Adherent':
          response = await axios.get(`/api/adherents?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'Visiteur':
          response = await axios.get(`/api/non-adherents?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'Partenaire':
          response = await axios.get(`/api/partenaires?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        default:
          return;
      }

      setData(prevData => {
        const newData = response.data.filter(item => !prevData.some(existingItem => existingItem.id === item.id));
        return [...prevData, ...newData];
      });
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const lastElementRef = useRef();
  const lastElementCallback = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchData(categories[currentCategory], nextPage);
          return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  };

  const handlePrevious = () => {
    setCurrentCategory((prevCategory) => (prevCategory === 0 ? categories.length - 1 : prevCategory - 1));
  };

  const handleNext = () => {
    setCurrentCategory((prevCategory) => (prevCategory === categories.length - 1 ? 0 : prevCategory + 1));
  };

  const renderTable = () => {
    switch (categories[currentCategory]) {
      case 'Adherent':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Numéro d'adhérent</th>
                  <th className="py-2 px-4 text-left">Nom</th>
                  <th className="py-2 px-4 text-left">Prénom</th>
                  <th className="py-2 px-4 text-left">CIN</th>
                  <th className="py-2 px-4 text-left">Motif de la visite</th>
                  <th className="py-2 px-4 text-left">Date d'insertion</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50" ref={index === data.length - 1 ? lastElementCallback : null}>
                    <td className="py-2 px-4">{item.adherentNumber}</td>
                    <td className="py-2 px-4">{item.nom}</td>
                    <td className="py-2 px-4">{item.prenom}</td>
                    <td className="py-2 px-4">{item.cin}</td>
                    <td className="py-2 px-4">{item.visitReason}</td>
                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Visiteur':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Nom</th>
                  <th className="py-2 px-4 text-left">Prénom</th>
                  <th className="py-2 px-4 text-left">CIN</th>
                  <th className="py-2 px-4 text-left">PPR</th>
                  <th className="py-2 px-4 text-left">Téléphone</th>
                  <th className="py-2 px-4 text-left">Région</th>
                  <th className="py-2 px-4 text-left">Province</th>
                  <th className="py-2 px-4 text-left">Commune</th>
                  <th className="py-2 px-4 text-left">Date d'insertion</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(item => item.ppr).map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50" ref={index === data.length - 1 ? lastElementCallback : null}>
                    <td className="py-2 px-4">{item.nom}</td>
                    <td className="py-2 px-4">{item.prenom}</td>
                    <td className="py-2 px-4">{item.cin}</td>
                    <td className="py-2 px-4">{item.ppr}</td>
                    <td className="py-2 px-4">{item.phone}</td>
                    <td className="py-2 px-4">{item.region}</td>
                    <td className="py-2 px-4">{item.province}</td>
                    <td className="py-2 px-4">{item.commune}</td>
                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Partenaire':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Nom de l’entreprise/organisme</th>
                  <th className="py-2 px-4 text-left">Téléphone</th>
                  <th className="py-2 px-4 text-left">Type de partenariat</th>
                  <th className="py-2 px-4 text-left">Date d'insertion</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50" ref={index === data.length - 1 ? lastElementCallback : null}>
                    <td className="py-2 px-4">{item.companyName}</td>
                    <td className="py-2 px-4">{item.phone}</td>
                    <td className="py-2 px-4">{item.partnershipType}</td>
                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-35">
      <div className="flex justify-center items-center mb-4 space-x-4">
        <button 
          onClick={handlePrevious} 
          className="px-4 py-2 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400 transition">
          ←
        </button>
        <span 
          className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white">
          {categories[currentCategory]}
        </span>
        <button 
          onClick={handleNext} 
          className="px-4 py-2 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400 transition">
          →
        </button>
      </div>
      {renderTable()}
    </div>
  );
};

export default CategorySwitcher;
