import { useEffect, useState } from "react"
import { View, Image, Button, TextInput, Text, Switch, StyleSheet, ScrollView, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Contact } from "../models/Contact";
import { saveContactData, updateContactData } from "../database/contactDao";

export const DataInput = (props: any) => {

    const updatedContact = props.route ? props.route.params.updatedContact : undefined;
    const [name, setName] = useState('');
    const [phone_no, setPhone_no] = useState('');
    const [landline_no, setLandline_no] = useState('');
    const [isFavourite, setIsFavourite] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {

        if (updatedContact) {
            setImage(updatedContact.image);
            setName(updatedContact.name);
            setPhone_no(updatedContact.phone_no);
            setLandline_no(updatedContact.landline_no);
            setIsFavourite(updatedContact.is_favourite === 1 ? true : false);
            setImageUrl(updatedContact.image);
        }
    }, [])

    const selectImage = () => {
        let options = {
            storageOptions: {
                path: 'images',
            },
            mediaType: 'photo' as const,
            includeBase64: true,
        };

        launchImageLibrary(options, response => {
            const selectedAssets = response.assets || [];
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                if (updatedContact) {
                    setImageUrl(selectedAssets[0].base64!);
                }
                else {
                    setImageUrl(selectedAssets[0].uri!);
                }
                setImage(selectedAssets[0].base64!);
            }
        });
    };

    const saveContact = async () => {
        if (isValidDetails()) {
            const contact: Contact = {
                name: properName(name),
                phone_no: phone_no.trim(),
                landline_no: landline_no.trim(),
                image: image,
                is_favourite: isFavourite ? 1 : 0
            }
            try {
                const rowsAffected = await saveContactData(contact);
                if (rowsAffected > 0) {
                    Alert.alert("Contact Saved successfully");
                    clearFields();
                    props.navigation.goBack();
                }
            }
            catch (error) {
                console.error("Error saving contact", error);
            }
        }
    }

    const updateContact = async () => {
        if (isValidDetails()) {
            const contact: Contact = {
                name: properName(name),
                phone_no: phone_no.trim(),
                landline_no: landline_no.trim(),
                image: image,
                is_favourite: isFavourite ? 1 : 0,
                id: updatedContact.id
            }
            try {
                const rowsAffected = await updateContactData(contact);
                if (rowsAffected > 0) {
                    Alert.alert("Contact Updated successfully");
                    clearFields();
                    props.navigation.goBack();
                }
            }
            catch (error) {
                console.error("Error updating contact", error);
            }
        }
    }
    const clearFields = () => {
        setName('');
        setPhone_no('');
        setLandline_no('');
        setImageUrl('');
        setImage('');
        setIsFavourite(false);
    }
    const properName = (inputString: string) => {
        const words = inputString.split(" ");
        const capitalizedWords = words.map(word => {
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return "";
        });

        const outputString = capitalizedWords.join(" ");

        return outputString;
    }

    const isValidDetails = () => {
        if (!name.trim() || !phone_no.trim() || !landline_no.trim()) {
            Alert.alert("All Fields are mandatory")
            return false;
        }
        if (!image.trim()) {
            Alert.alert("Please Select an image")
            return false;
        }

        if (isNaN(Number(phone_no)) || isNaN(Number(landline_no))) {
            Alert.alert("Phone and landline no must e numeric")
            return false;
        }
        if (landline_no.trim().length !== 6) {
            Alert.alert("Landline no. must have 6 digits")
            return false;
        }
        if (phone_no.trim().length !== 10) {
            Alert.alert("Phone no. must have 10 digits")
            return false;
        }
        return true;
    }
    return (
        <>
            <ScrollView >
                <View style={{ marginTop: 10 }}>
                    <View style={styles.selectImageButton}>
                        {imageUrl && <Image source={updatedContact ? { uri: `data:image/png;base64,${imageUrl}` } : { uri: imageUrl }} style={styles.image} />}
                        <Button
                            title="Select Image"
                            color={'skyblue'}
                            onPress={selectImage}
                        />
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter Name"
                        value={name}
                        onChangeText={name => setName(name)}></TextInput>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter Mobile Number"
                        keyboardType="numeric"
                        value={phone_no.toString()}
                        onChangeText={mobile =>
                            setPhone_no(mobile)
                        }></TextInput>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter LandLine Number"
                        keyboardType="numeric"
                        value={landline_no.toString()}
                        onChangeText={landline =>
                            setLandline_no(landline)
                        }></TextInput>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexGrow: 1,
                            justifyContent: 'center',
                            borderBottomWidth: 0.8,
                            paddingBottom: 15,
                        }}>
                        <Text style={{ fontSize: 20, marginLeft: 15, flexGrow: 1 }}>
                            Add to Favorite Contacts -
                        </Text>
                        <Switch value={isFavourite} onValueChange={() => {
                            setIsFavourite(!isFavourite)
                        }} />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button title={updatedContact ? "Update Contact" : "Save Contact"} color={'green'} onPress={updatedContact ? updateContact : saveContact} />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'thistle',
        padding: 10,
    },
    textInput: {
        borderWidth: 2,
        borderColor: 'skyblue',
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30,
        borderRadius: 10,
    },
    footer: {
        position: 'relative',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 100,
    },
    selectImageButton: {
        marginBottom: 30,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 200,
    },
});