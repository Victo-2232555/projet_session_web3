
//src/common/constants/Paths.ts
export default {
  Base: '/api', // Donne accès à la documentation de l'API via /api
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },

  Produit: {
    Base: '/produits',
    GetAll: '/all',
    GetWithFiltres: '/filtres',
    GetOne: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    
  },

  Utilisateur: {
    Base: '/utilisateurs',
    GetAll: '/all',
    GetOne: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },

} as const;

