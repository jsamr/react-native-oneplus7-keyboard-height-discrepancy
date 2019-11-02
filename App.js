import React from 'react';
import {
  View,
  TextInput,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { DebugKeyboardAvoidingView } from './DebugKeyboardAvoidingView'
const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <DebugKeyboardAvoidingView>
            <TextInput autoFocus />
            <View style={{ flex: 1 }} />
            <View style={{ height: 40, backgroundColor: 'black', width: "100%" }} />
        </DebugKeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default App;
