import { initDB } from "./database.js";

// Fonctions pour les listes

export const getLists = async () => {
    const db = await initDB();
    try {
        const result = await db.getAllAsync(`SELECT * FROM lists`);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des listes :', error);
        throw error;
    }
};

export const getListById = async (id) => {
    const db = await initDB();
    try {
        return await db.getFirstAsync(`SELECT * FROM lists WHERE id = ?`, [id]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste :', error);
        throw error;
    }
};

export const createList = async (name) => {
    const db = await initDB();
    try {
        await db.runAsync(`INSERT INTO lists (name) VALUES (?)`, [name]);

        const result = await db.getFirstAsync(`SELECT last_insert_rowid() as id`);
        console.log('Liste créée avec ID:', result.id);
        return result.id;
    } catch (error) {
        console.error('Erreur lors de la création de la liste :', error);
        throw error;
    }
};

export const updateList = async (id, name) => {
    const db = await initDB();
    try {
        const result = await db.execAsync(
            `UPDATE lists SET name = ? WHERE id = ?`,
            [name, id]
        );
        return result.rowsAffected;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste :', error);
        throw error;
    }
};

export const deleteList = async (id) => {
    const db = await initDB();
    try {
        await db.runAsync(`DELETE FROM lists WHERE id = ?`, [id]);
    } catch (error) {
        console.error("Erreur lors de la suppression de la liste : ", error);
        throw error;
    }
};

// Fonctions pour les produits

export const getProducts = async (listId) => {
    const db = await initDB();
    try {
        const result = await db.getAllAsync(
            `SELECT * FROM products WHERE list_id = ?`,
            [listId]
        );
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    const db = await initDB();
    try {
        const result = await db.execAsync(
            `SELECT * FROM products WHERE id = ?`,
            [id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        throw error;
    }
};

export const createProduct = async ({ name, quantity, price, isWeighable, listId, isAdd }) => {
    const db = await initDB();
    try {
        const result = await db.runAsync(
            `INSERT INTO products (name, quantity, price, isWeighable, list_id, isAdd) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, quantity, price, isWeighable ? 1 : 0, listId, isAdd ? 1 : 0]
        );
        return result.insertId;
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        throw error;
    }
};

export const updateProduct = async (id, { name, quantity, price, isWeighable, listId, isAdd }) => {
    const db = await initDB();
    try {
        const result = await db.runAsync(
            `UPDATE products SET name = ?, quantity = ?, price = ?, isWeighable = ?, list_id = ?, isAdd = ? WHERE id = ?`,
            [name, quantity, price, isWeighable ? 1 : 0, listId, isAdd ? 1 : 0, id]
        );
        return result.rowsAffected;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    const db = await initDB();
    try {
        await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
    } catch (error) {
        console.error("Erreur lors de la suppression du produit : ", error);
        throw error;
    }
};