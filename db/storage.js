import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const LISTS_KEY = 'courseo_lists';
const PRODUCTS_KEY = 'courseo_products';

// Fonctions pour les listes
export const getLists = async () => {
  try {
    const listsJson = await AsyncStorage.getItem(LISTS_KEY);
    return listsJson ? JSON.parse(listsJson) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des listes :', error);
    throw error;
  }
};

export const getListById = async (id) => {
  try {
    const lists = await getLists();
    return lists.find(list => list.id === id) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste :', error);
    throw error;
  }
};

export const createList = async (name) => {
  try {
    const lists = await getLists();
    const newList = {
      id: Date.now().toString(), // Utiliser un timestamp comme ID
      name,
      date: new Date().toISOString()
    };
    
    lists.push(newList);
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    
    return newList.id;
  } catch (error) {
    console.error('Erreur lors de la création de la liste :', error);
    throw error;
  }
};

export const updateList = async (id, name) => {
  try {
    const lists = await getLists();
    const index = lists.findIndex(list => list.id === id);
    
    if (index !== -1) {
      lists[index].name = name;
      await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
      return 1; // Simuler rowsAffected
    }
    
    return 0;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste :', error);
    throw error;
  }
};

export const deleteList = async (id) => {
  try {
    const lists = await getLists();
    const filteredLists = lists.filter(list => list.id !== id);
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(filteredLists));
    
    // Supprimer également tous les produits associés à cette liste
    const products = await getProducts(id);
    for (const product of products) {
      await deleteProduct(product.id);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste : ", error);
    throw error;
  }
};

// Fonctions pour les produits
export const getProducts = async (listId) => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const allProducts = productsJson ? JSON.parse(productsJson) : [];
    return allProducts.filter(product => product.listId === listId);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const allProducts = productsJson ? JSON.parse(productsJson) : [];
    return allProducts.find(product => product.id === id) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error);
    throw error;
  }
};

export const createProduct = async ({ name, quantity, price, isWeighable, listId, isAdd }) => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products = productsJson ? JSON.parse(productsJson) : [];
    
    const newProduct = {
      id: Date.now().toString(), // Utiliser un timestamp comme ID
      name,
      quantity,
      price,
      isWeighable,
      listId,
      isAdd
    };
    
    products.push(newProduct);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    
    return newProduct.id;
  } catch (error) {
    console.error('Erreur lors de la création du produit :', error);
    throw error;
  }
};

export const updateProduct = async (id, { name, quantity, price, isWeighable, listId, isAdd }) => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products = productsJson ? JSON.parse(productsJson) : [];
    const index = products.findIndex(product => product.id === id);
    
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name,
        quantity,
        price,
        isWeighable,
        listId,
        isAdd
      };
      
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return 1; // Simuler rowsAffected
    }
    
    return 0;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit :', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products = productsJson ? JSON.parse(productsJson) : [];
    const filteredProducts = products.filter(product => product.id !== id);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
  } catch (error) {
    console.error("Erreur lors de la suppression du produit : ", error);
    throw error;
  }
};

// Fonction pour réinitialiser toutes les données
export const resetStorage = async () => {
  try {
    await AsyncStorage.removeItem(LISTS_KEY);
    await AsyncStorage.removeItem(PRODUCTS_KEY);
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du stockage : ", error);
    throw error;
  }
}; 