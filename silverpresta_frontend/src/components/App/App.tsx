// src/components/App/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Produits from '../Produits/Produits';
import UserList from '../UserList/UserList';
import Menu from '../Menu/Menu';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Page de connexion (hors Menu) */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées avec le Menu comme layout */}
      <Route element={<Menu />}>
        <Route path="/" element={<Navigate to="/produits" replace />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/utilisateurs" element={<UserList />} />
      </Route>

      {/* Route par défaut / inconnue */}
      <Route path="*" element={<Navigate to="/produits" replace />} />
    </Routes>
  );
}

export default App;
