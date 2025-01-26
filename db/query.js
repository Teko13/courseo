import { initDB } from "./database";

export const getProducts = async () => {
    const db = await initDB();
    try {
        const result = await db.getAllAsync(`SELECT * FROM products`);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    const db = await initDB();
    try {
        const result = await db.execAsync(`SELECT * FROM products WHERE id = ?`, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        throw error;
    }
};

export const createProduct = async ({name, quantity, price, isWeighable}) => {
    console.log(name);
    const db = await initDB();
    try {
        const result = await db.runAsync(
            `INSERT INTO products (name, quantity, price, isWeighable) VALUES (?, ?, ?, ?)`,
            [name, quantity, price, isWeighable ? 1 : 0]
        );
        return result.insertId;
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        throw error;
    }
};

export const updateProduct = async (id, { name, quantity, price, isWeighable }) => {
    const db = await initDB();
    try {
        const result = await db.execAsync(
            `UPDATE products SET name = ?, quantity = ?, price = ?, isWeighable = ? WHERE id = ?`,
            [name, quantity, price, isWeighable ? 1 : 0, id]
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
        console.error("erreur lors de la suppression: ", error);
        throw error;
    }
}
