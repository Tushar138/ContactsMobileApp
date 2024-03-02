import { useEffect, useState } from "react"
import { Contact } from "../models/Contact"
import { getAllContacts } from "../database/contactDao"
import { useIsFocused } from "@react-navigation/native"
import { ContactsList } from "./ContactsList"

export const ContactsListScreen = (props: any) => {
    const [contactsList, setContactsList]
        = useState<Contact[]>([]);
    const isFocused = useIsFocused();

    const setContacts = async () => {
        if (isFocused) {
            try {
                const contacts = await getAllContacts();
                setContactsList(contacts);
            }
            catch (error) {
                console.error("Error Fetching contacts", error);
            }
        }
    }
    useEffect(() => {
        setContacts();
    }, [isFocused])


    return (
        <>
            <ContactsList contacts={contactsList} navigation={props.navigation}></ContactsList>
        </>
    )
}