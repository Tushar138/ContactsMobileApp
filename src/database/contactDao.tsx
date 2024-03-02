import { Contact } from "../models/Contact";
import { db } from "./sqliteconfig";

export const getAllContacts = async () => {
    const sql = "SELECT * FROM contacts ORDER BY name ASC";
    const contactsList: Contact[] = [];
    const dbInstance = (await db);
    const result: any = await executeSqlQuery(dbInstance, sql, []);
    for (let i = 0; i < result.rows.length; i++) {
        contactsList.push(result.rows.item(i));
    }
    return contactsList;
}

export const getAllFavouriteContacts = async () => {
    const sql = "SELECT * FROM contacts WHERE is_favourite=1 ORDER BY name ASC";
    const contactsList: Contact[] = [];
    const dbInstance = (await db);
    const result: any = await executeSqlQuery(dbInstance, sql, []);
    for (let i = 0; i < result.rows.length; i++) {
        contactsList.push(result.rows.item(i));
    }
    return contactsList;
}



export const saveContactData = async (contact: Contact) => {
    const sql = "INSERT INTO contacts(name,phone_no,landline_no,is_favourite,image) VALUES (?,?,?,?,?)";
    const dbInstance = (await db);
    let rowsAffected = -1;
    const result: any = await executeSqlQuery(dbInstance, sql, [contact.name,
    contact.phone_no,
    contact.landline_no,
    contact.is_favourite,
    contact.image]);
    rowsAffected = result.rowsAffected
    return rowsAffected;
}

export const updateContactData = async (contact: Contact) => {
    const sql = "UPDATE contacts SET name=?,phone_no=?,landline_no=?,is_favourite=?,image=? WHERE id=?";
    const dbInstance = (await db);
    let rowsAffected = -1;
    const result: any = await executeSqlQuery(dbInstance, sql, [contact.name,
    contact.phone_no,
    contact.landline_no,
    contact.is_favourite,
    contact.image,
    contact.id]);
    rowsAffected = result.rowsAffected
    return rowsAffected;
}

export const deleteContactById = async (id: number) => {
    const sql = "DELETE FROM contacts WHERE id = ?";
    const dbInstance = (await db);
    let rowsAffected = -1;
    const result: any = await executeSqlQuery(dbInstance, sql, [id]);
    rowsAffected = result.rowsAffected;
    return rowsAffected;
}


const executeSqlQuery = (dbInstance: any, sql: string, params: any[]) => {
    return new Promise((resolve, reject) => {
        dbInstance.transaction((tx: any) => {
            tx.executeSql(
                sql,
                params,
                (tx: any, result: any) => {
                    resolve(result);
                },
                (error: any) => {
                    reject(error);
                }
            );
        });
    });
}