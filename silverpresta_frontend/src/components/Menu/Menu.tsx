// src/components/Menu/Menu.tsx

import { useContext, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';

function Menu() {
  const { isLoggedIn, logout } = useContext(LoginContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          
          <ul className="flex space-x-6">
            <li>
              <Link to="/utilisateurs" className="text-white hover:text-gray-300">
                Utilisateurs
              </Link>
            </li>
            <li>
              <Link to="/produits" className="text-white hover:text-gray-300">
                Produits
              </Link>
            </li>
          </ul>

          <button
            className="text-green hover:text-red-400 font-semibold"
            onClick={() => logout()}
          >
            Se déconnecter
          </button>

        </div>
      </nav>

      {/* Affichage du contenu des pages enfants */}
      <Outlet />
    </>
  );
}

export default Menu;
