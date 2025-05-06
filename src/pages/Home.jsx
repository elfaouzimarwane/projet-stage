import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategorySwitcher from '../components/CategorySwitcher';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const adherentResults = searchResults.filter(result => result.type === 'Adherent');
  const visiteurResults = searchResults.filter(result => result.type === 'NonAdherent');
  const partenaireResults = searchResults.filter(result => result.type === 'Partenaire');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar setSearchResults={setSearchResults} setError={setError} />
      {searchResults.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Search Results:</h2>
          {adherentResults.length > 0 && (
            <div className="mt-18">
              <h3 className="text-lg font-bold mb-2">Adherents</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Numéro d'adhérent</th>
                      <th className="py-2 px-4 text-left">CIN</th>
                      <th className="py-2 px-4 text-left">Motif de la visite</th>
                      <th className="py-2 px-4 text-left">Date d'insertion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adherentResults.map((result, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{result.adherentNumber}</td>
                        <td className="py-2 px-4">{result.cin}</td>
                        <td className="py-2 px-4">{result.visitReason}</td>
                        <td className="py-2 px-4">{formatDate(result.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {visiteurResults.length > 0 && (
            <div className="mt-18">
              <h3 className="text-lg font-bold mb-2">Visiteurs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Nom</th>
                      <th className="py-2 px-4 text-left">Prénom</th>
                      <th className="py-2 px-4 text-left">CIN</th>
                      <th className="py-2 px-4 text-left">PPR</th>
                      <th className="py-2 px-4 text-left">Téléphone</th>
                      <th className="py-2 px-4 text-left">Province</th>
                      <th className="py-2 px-4 text-left">Commune</th>
                      <th className="py-2 px-4 text-left">Date d'insertion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiteurResults.map((result, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{result.nom}</td>
                        <td className="py-2 px-4">{result.prenom}</td>
                        <td className="py-2 px-4">{result.cin}</td>
                        <td className="py-2 px-4">{result.ppr}</td>
                        <td className="py-2 px-4">{result.phone}</td>
                        <td className="py-2 px-4">{result.province}</td>
                        <td className="py-2 px-4">{result.commune}</td>
                        <td className="py-2 px-4">{formatDate(result.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {partenaireResults.length > 0 && (
            <div className="mt-18">
              <h3 className="text-lg font-bold mb-2">Partenaires</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Nom de l’entreprise</th>
                      <th className="py-2 px-4 text-left">Téléphone</th>
                      <th className="py-2 px-4 text-left">Type de partenariat</th>
                      <th className="py-2 px-4 text-left">Date d'insertion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partenaireResults.map((result, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{result.companyName}</td>
                        <td className="py-2 px-4">{result.phone}</td>
                        <td className="py-2 px-4">{result.partnershipType}</td>
                        <td className="py-2 px-4">{formatDate(result.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <CategorySwitcher />
      )}
    </div>
  );
};

export default Home;
