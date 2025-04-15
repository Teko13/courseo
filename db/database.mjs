import { resetStorage } from './storage.js';

// Script pour réinitialiser la base de données
const resetDatabase = async () => {
  try {
    await resetStorage();
    console.log('Base de données réinitialisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données:', error);
  }
};

// Exécuter la réinitialisation si le script est appelé directement
if (process.argv.includes('resetDatabase')) {
  resetDatabase();
}

export { resetDatabase }; 