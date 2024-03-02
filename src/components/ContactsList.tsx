import { useEffect, useState } from "react"
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import { Contact } from "../models/Contact"
import { deleteContactById, getAllContacts } from "../database/contactDao"

export const ContactsList = (props: any) => {
    const [contactsList, setContactsList]
        = useState<Contact[]>([]);
    const [allContactsList, setAllContactsList]
        = useState<Contact[]>([]);
    const [searchText, setSearchText] = useState('');


    const setContacts = async () => {
        try {
            const contacts = props.contacts;
            setContactsList(contacts);
            setAllContactsList(contacts);
        }
        catch (error) {
            console.error("Error Fetching contacts", error);
        }
    }
    useEffect(() => {
        setContacts();
    }, [props.contacts])

    const deleteContact = (id: number) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this contact?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const rowsAffected = await deleteContactById(id);
                        if (rowsAffected > 0) {
                            Alert.alert('Contact deleted successfully');
                            const newAllContactsList = [...allContactsList.filter(item => item.id != id)];
                            const newContactsList = [...contactsList.filter(item => item.id != id)];

                            setContactsList([]);
                            setAllContactsList([]);
                            setContactsList(newContactsList);
                            setAllContactsList(newAllContactsList);

                        }
                        else {
                            Alert.alert("Failed to delete contact");
                        }
                    }
                }
            ], { cancelable: true },
        );
    }
    const swipeRight = (item: any) => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    height: 100,
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    onPress={() => deleteContact(item.id)}
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text style={{ fontSize: 20, color: 'white', paddingBottom: 15 }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const searchContacts = (text: string) => {
        setSearchText(text);
        if (text.trim()) {
            setContactsList(contactsList.filter(contact => contact.name.toLowerCase().includes(text.toLowerCase())));
        }
        else {
            setContactsList(allContactsList);
        }
    }
    const contactImage = (contact: any) => {
        return (
            <Image
                style={styles.contactImage}
                source={{ uri: `data:image/png;base64,${contact.image}` }}
            />
        );
    };
    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.search}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={searchContacts}
                        placeholder="Search by name"
                    />
                </View>
                <FlatList
                    style={styles.flatList}
                    data={contactsList}
                    renderItem={({ item }) => (
                        <Swipeable renderRightActions={() => swipeRight(item)}>
                            <TouchableOpacity
                                style={styles.contactsList}
                                onPress={() => {
                                    props.navigation.navigate("UpdateContactScreen", {
                                        updatedContact: item
                                    });
                                }}
                            >
                                {contactImage(item)}
                                <Text style={styles.contactName}>{item.name}</Text>
                            </TouchableOpacity>
                        </Swipeable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                    style={styles.addContactButton}
                    onPress={() => props.navigation.navigate('AddContactScreen')}>
                    <Text style={styles.addContactButtonText}>+</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '95%',
        marginLeft: 10,
        marginTop: 10,
    },
    flatList: {
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 15,
        paddingHorizontal: 5,
        fontSize: 18,
        paddingLeft: 12,
    },
    addContactButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'blue',
        borderRadius: 40,
        padding: 5,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    addContactButtonText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'normal',
    },
    contactsList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginBottom: 15,
    },
    contactImage: {
        width: 45,
        height: 45,
        borderRadius: 30,
        marginRight: 12,
    },
    contactName: {
        fontSize: 23,
        marginLeft: 18,
    },
});