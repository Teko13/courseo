import * as SQLite from 'expo-sqlite';

const getConnection = async () => {
    try {
        return await SQLite.openDatabaseAsync("app_database.db");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
        throw error;
    }
};

const initDB = async () => {
    const db = await getConnection();
    try {
        // Création de la table lists
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS lists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Création de la table products avec une clé étrangère vers lists
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL,
                isWeighable INTEGER NOT NULL,
                list_id INTEGER,
                FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
            )
        `);

        return db;
    } catch (error) {
        console.error("Erreur lors de la création des tables :", error);
        throw error;
    }
};

const dropAllTables = async () => {
    const db = await getConnection();
    try {
        // Récupérer la liste de toutes les tables utilisateur
        const tablesResult = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence', 'sqlite_master')"
        );
        
        // Parcourir et supprimer chaque table
        for (const table of tablesResult) {
            await db.runAsync(`DROP TABLE IF EXISTS ${table.name}`);
        }
        return db;
    } catch (error) {
        console.error("Erreur lors de la suppression des tables :", error);
        throw error;
    }
};


const resetDatabase = async () => {
    await dropAllTables();
    await initDB(); // Recréer les tables initiales
};

export {initDB, resetDatabase}