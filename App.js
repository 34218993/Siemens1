/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [gifs, setGifs] = useState([]);
  const [favGifs, setFavGifs] = useState([]);
  const [term, updateTerm] = useState('');

  function HomeScreen() {
    return (
      <View style={styles.view}>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search Giphy"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={term}
            onChangeText={text => onEdit(text)}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              fetchGifs();
            }}>
            <Ionicons name={'search-sharp'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={gifs}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setFavGifs([
                  ...favGifs,
                  {
                    id: favGifs.length,
                    url: item.images.original.url,
                  },
                ]);
                Alert.alert('Addedd favourite pic');
                console.log('add', favGifs);
              }}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{uri: item.images.original.url}}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  function favScreen() {
    return (
      <View style={styles.view}>
        <FlatList
          data={favGifs}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setFavGifs(favGifs.filter(favGif => favGif.url !== item.url));
                Alert.alert('Removed favourite pic' + `${item.id + 1}`);
                console.log('remove', favGifs);
              }}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{uri: item.url}}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const Tab = createBottomTabNavigator();

  async function fetchGifs() {
    try {
      const API_KEY = 'HdrDq05cyqX8Ov2uIX5uC5OK8COXpjZY';
      const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
      console.log(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
      const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
      const res = await resJson.json();
      setGifs(res.data);
    } catch (error) {
      console.warn(error);
    }
  }

  async function onEdit(newTerm) {
    updateTerm(newTerm);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Favourite') {
              iconName = focused
                ? 'heart-circle-sharp'
                : 'heart-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Favourite" component={favScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'darkblue',
  },
  textInput: {
    width: '100%',
    height: 50,
    color: 'white',
    backgroundColor: 'purple',
  },
  image: {
    width: 300,
    height: 150,
    borderWidth: 3,
    marginBottom: 5,
  },
  icon: {
    marginLeft: 5,
    marginTop: 13,
  },
  searchRow: {
    flexDirection: 'row',
  },
});
