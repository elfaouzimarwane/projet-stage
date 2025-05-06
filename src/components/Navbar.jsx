import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
    const location = useLocation();
    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Adhérent', href: '/adherent' },
        { name: 'Visiteur', href: '/visiteur' },
        { name: 'Partenaire', href: '/partenaire' },
    ];

    const isAdmin = localStorage.getItem('username') === 'admin';

    return (
        <nav className="fixed top-0 right-0 left-0 bg-gray-100 shadow-md border-b border-gray-300 p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-gray-800 text-lg font-bold flex items-center">
                    <img src="/img/image-removebg-preview.png" alt="Logo" className="h-8 w-45 mr-2" />
                </div>
                <ul className="flex space-x-6 mx-auto">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className={`text-gray-800 hover:text-blue-600 pb-2 transition-all duration-300 ${
                                    location.pathname === item.href ? 'border-b-4 border-blue-600' : ''
                                }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    {isAuthenticated && isAdmin && (
                        <li>
                            <Link
                                to="/create-account"
                                className={`text-gray-800 hover:text-blue-600 pb-2 transition-all duration-300 ${
                                    location.pathname === '/create-account' ? 'border-b-4 border-blue-600' : ''
                                }`}
                            >
                                Créer un compte
                            </Link>
                        </li>
                    )}
                </ul>
                {isAuthenticated && (
                    <button onClick={onLogout} className="text-gray-800 hover:text-red-500 cursor-pointer transition-all duration-300">
                        Déconnecter
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
