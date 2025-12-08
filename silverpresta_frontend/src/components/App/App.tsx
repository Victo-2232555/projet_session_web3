// src/components/App/App.tsx
import { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import Login from '../Login/Login';
import Produits from '../Produits/Produits';
import UserList from '../UserList/UserList';
import Menu from '../Menu/Menu';
import AjoutProduit from '../Produits/AjoutProduit';
import ModifierProduit from '../Produits/ModifierProduit';
import SupprimerProduit from '../Produits/SupprimerProduit';
import FiltrerProduit from '../Produits/FiltrerProduit';

import Francais from '../../lang/fr.json';
import Anglais from '../../lang/en.json';

import './App.css';

const messagesParLangue: Record<'fr' | 'en', Record<string, string>> = {
  fr: Francais,
  en: Anglais,
};

function App() {
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');

  const messages = useMemo(() => messagesParLangue[locale], [locale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route element={<Menu setLocale={setLocale} locale={locale} />}>
          <Route path="/" element={<Navigate to="/produits" replace />} />

          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/add" element={<AjoutProduit />} />
          <Route path="/produits/filtrer" element={<FiltrerProduit />} />
          <Route path="/produits/modifier/:id" element={<ModifierProduit />} />
          <Route path="/produits/supprimer/:id" element={<SupprimerProduit />} />

          <Route path="/utilisateurs" element={<UserList />} />
        </Route>

        <Route path="*" element={<Navigate to="/produits" replace />} />
      </Routes>
    </IntlProvider>
  );
}

export default App;
