// src/components/Menu/Menu.tsx
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';

interface IMenuProps {
  setLocale: (lang: 'fr' | 'en') => void;
  locale: 'fr' | 'en';
}

function Menu({ setLocale, locale }: IMenuProps) {
  const { isLoggedIn, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn]);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          
          {/* MENU GAUCHE */}
          <ul className="flex space-x-4">
            <li>
              <a href="/produits" className="text-white hover:text-gray-300">
                Produits
              </a>
            </li>
            <li>
              <a href="/utilisateurs" className="text-white hover:text-gray-300">
                Utilisateurs
              </a>
            </li>
          </ul>

          {/* ACTIONS À DROITE */}
          <div className="flex items-center gap-3">

            {/* Sélecteur de langue */}
            <button
              onClick={() => setLocale('fr')}
              className={`px-3 py-1 rounded text-sm ${
                locale === 'fr'
                  ? 'bg-white text-gray-800 font-semibold'
                  : 'text-white border border-white'
              }`}
            >
              FR
            </button>

            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 rounded text-sm ${
                locale === 'en'
                  ? 'bg-white text-gray-800 font-semibold'
                  : 'text-white border border-white'
              }`}
            >
              EN
            </button>

            {/* Déconnexion */}
            <button
              className="text-white hover:text-gray-300 ml-4"
              onClick={logout}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default Menu;
