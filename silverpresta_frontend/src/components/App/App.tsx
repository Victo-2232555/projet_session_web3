// src/components/App/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Produits from '../Produits/Produits';
import UserList from '../UserList/UserList';
import Menu from '../Menu/Menu';
import AjoutProduit from '../Produits/AjoutProduit';
import ModifierProduit from '../Produits/ModifierProduit';
import SupprimerProduit from '../Produits/SupprimerProduit';
import './App.css';



function App() {
  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées et imbriquées dans le Menu */}
      <Route element={<Menu />}>
        {/* route par défaut après login */}
        <Route path="/" element={<Navigate to="/produits" replace />} />

        {/* Produits */}
        <Route path="/produits" element={<Produits />} />
        <Route path="/produits/add" element={<AjoutProduit />} />
        <Route path="/produits/modifier/:id" element={<ModifierProduit />} />
        <Route path="/produits/supprimer/:id" element={<SupprimerProduit />} />

        {/* Utilisateurs */}
        <Route path="/utilisateurs" element={<UserList />} />
      </Route>

      {/* Route par défaut (fallback) */}
      <Route path="*" element={<Navigate to="/produits" replace />} />
    </Routes>
  );
}

export default App;
