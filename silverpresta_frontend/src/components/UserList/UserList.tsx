// src/components/UserList/UserList.tsx

import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface IUtilisateur {
  _id: string;
  nom: string;
  prenom: string;
  courriel: string;
  role: string;
  actif: boolean;
  date_creation?: string;
}

function UserList() {
  const listeVide: IUtilisateur[] = [];
  const { isLoggedIn, token } = useContext(LoginContext);
  const [userList, setUserList] = useState(listeVide);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3000/api/utilisateurs/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUserList(response.data.utilisateurs));
    }
  }, [isLoggedIn]);

  return (
    <>
      {userList.map((user) => (
        <div
          key={user._id}
          className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4"
        >
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              {user.prenom} {user.nom}
            </div>

            <p className="text-gray-700 text-base">{user.courriel}</p>

            <p className="text-gray-700 text-sm">
              Rôle : {user.role}
            </p>

            <p className="text-gray-700 text-sm">
              Statut : {user.actif ? 'Actif' : 'Inactif'}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Créé le : {new Date(user.date_creation || '').toLocaleDateString('fr-CA')}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export default UserList;
