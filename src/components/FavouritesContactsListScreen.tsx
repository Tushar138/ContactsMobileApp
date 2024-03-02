import { useEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native";
import { getAllFavouriteContacts } from "../database/contactDao";
import { Contact } from "../models/Contact";
import { ContactsList } from "./ContactsList";

export const FavouritesContactsListScreen = (props: any) => {
    const [contactsList, setContactsList]
        = useState<Contact[]>([]);
    const isFocused = useIsFocused();
    const setContacts = async () => {
        if (isFocused) {
            try {
                const contacts = await getAllFavouriteContacts();
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