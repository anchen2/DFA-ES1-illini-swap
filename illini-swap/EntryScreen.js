import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');


const EntryScreen = ({ navigation }) => {
 return (
   <View style={styles.container}>
     <Text style={styles.title}>Illini{'\n'}Swap</Text>
     <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
       <Text style={styles.loginText}>Login</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Sign Up')}>
       <Text style={styles.signUpText}>Sign Up</Text>
     </TouchableOpacity>
   </View>
 );
};


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#FAF7E8',
   justifyContent: 'center',
   alignItems: 'center',
 },
 greenRectangle: {
    width: '100%',
    height: 171,
    backgroundColor: '#1F4035',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
 },
 logo: {
    width: 200,
    height: 80,
  },
 loginButton: {
   backgroundColor: '#FCA26E',
   width: 168,
   height: 46,
   borderRadius: 20,
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: 507,
   marginLeft: 117,
 },
 loginText: {
   color: '#FAF7E8',
   fontSize: 22,
   fontWeight: '600',
   fontFamily: 'Montserrat',
   textAlign: 'center',
   lineHeight: 26.82,
 },
 signUpButton: {
   backgroundColor: '#FAF7E8',
   width: 168,
   height: 46,
   borderRadius: 20,
   justifyContent: 'center',
   alignItems: 'center',
   borderWidth: 3,
   borderColor: '#FCA26E',
   marginTop: 581,
   marginLeft: 117,
 },
 signUpText: {
   color: '#F5751C',
   fontSize: 22,
   fontWeight: '600',
   fontFamily: 'Montserrat',
   textAlign: 'center',
   lineHeight: 26.82,
 },
});


export default EntryScreen;

