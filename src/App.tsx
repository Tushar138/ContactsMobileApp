import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';
import { ContactsListScreen } from './components/ContactsListScreen';
import { FavouritesContactsListScreen } from './components/FavouritesContactsListScreen';
import { AddContactScreen } from './components/AddContactScreen';
import { UpdateContactScreen } from './components/UpdateContactScreen';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const options = (title: string) => ({
  title: title,
  headerStyle: {
    backgroundColor: 'orange',
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'lucida grande',
  },
})

function App(): React.JSX.Element {


  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Drawer"
            component={Drawers}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddContactScreen"
            component={AddContactScreen}
            options={options("Add New Contact") as NativeStackNavigationOptions}
          />
          <Stack.Screen
            name="UpdateContactScreen"
            component={UpdateContactScreen}
            options={options("Update Contact") as NativeStackNavigationOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const Drawers = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name='ContactsList'
        component={ContactsListScreen}
        options={options("Contact List") as DrawerNavigationOptions}
      />
      <Drawer.Screen
        name="FavouritesContactsList"
        component={FavouritesContactsListScreen}
        options={options("Favorite Contacts") as DrawerNavigationOptions}
      />
    </Drawer.Navigator>
  )
}
export default App;