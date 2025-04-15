// Exporter toutes les fonctions de stockage
export * from './storage.js';

// Pour la compatibilité avec le code existant, nous exportons également les fonctions de réinitialisation
export const resetDatabase = async () => {
  const { resetStorage } = await import('./storage.js');
  await resetStorage();
}; 