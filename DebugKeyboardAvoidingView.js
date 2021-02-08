/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard, View, Text} from 'react-native';

function KeyboardHeightFootprint({keyboardHeight}) {
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'red',
        top: 0,
        right: 0,
        width: keyboardHeight,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          {translateX: keyboardHeight / 2 - 20},
          {rotate: '90deg'},
          {translateX: keyboardHeight / 2 - 20},
        ],
      }}>
      <Text style={{textTransform: 'uppercase'}}>
        Keyboard height: {keyboardHeight.toFixed(0)}
      </Text>
    </View>
  );
}

export const DebugKeyboardAvoidingView = ({children, style, ...props}) => {
  const [keyboardEnd, setKeyboardEnd] = useState({});
  const viewRef = useRef();
  const onKeyboardChange = useCallback(
    (ev) => setKeyboardEnd(ev.endCoordinates),
    [],
  );
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardChange);
    Keyboard.addListener('keyboardDidHide', onKeyboardChange);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardChange);
      Keyboard.removeListener('keyboardDidHide', onKeyboardChange);
    };
  }, [onKeyboardChange]);
  const keyboardHeight =
    typeof keyboardEnd.height !== 'number' ? 0 : keyboardEnd.height;
  return (
    <View
      {...props}
      ref={viewRef}
      style={[style, {flexGrow: 1}]}
      collapsable={false}>
      {children}
      <View
        style={{
          height: keyboardHeight,
          width: '100%',
        }}
      />
      <KeyboardHeightFootprint keyboardHeight={keyboardHeight} />
    </View>
  );
};
