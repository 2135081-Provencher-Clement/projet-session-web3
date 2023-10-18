/**
 * Express router paths go here.
 */


export default {
  Base: '/',
  Element: {
    Base: '/element',
    GetAll: '/',
    GetIdParNom: '/idParNom/:nom',
    GetNomParId: '/:id',
    Insert: '/ajouter',
    Update: '/miseAJour',
    Delete: '/supression/:id'
  },
  Race: {
    Base: '/race',
    GetAll: '/',
    GetById: '/:id',
    GetIdParNom: '/idParNom/:nom',
    Insert: '/ajouter',
    Update: '/miseAJour',
    Delete: '/supression/:id'
  },
  Monstre: {
    Base: '/monstre',
    GetAll: '/',
    GetById: '/:id',
    Insert: '/ajouter',
    Update: '/miseAJour',
    Delete: '/supression/:id'
  }
} as const;
