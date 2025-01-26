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
   // console.log(db);
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL,
                isWeighable INTEGER NOT NULL
            )
        `);
        //console.log("Table créée avec succès");
        return db;
    } catch (error) {
        console.error("Erreur lors de la création de la table :", error);
        throw error;
    }
};

export { initDB };
