import SQLite from 'react-native-sqlite-storage'


const db = SQLite.openDatabase({ name: 'test.db', location: 'default' });

const initDb = async () => {
    (await db).transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(25),phone_no TEXT, landline_no TEXT, is_favourite INTEGER DEFAULT 0,image TEXT)', [], () => console.log("Done Initialization"),
            (error) => console.error("An error occured while creating table contacts", error)
        );
    });
}

export { db, initDb };