import React from 'react';
import LottieView from 'lottie-react-native';


export function Lottie({ ...rest }) {
  return (
    <LottieView
      style={{
        width: 220,
        height: 220,
        alignSelf: 'center',
        marginTop: 20
      }}
      autoPlay
      loop
      resizeMode="cover"
      {...rest}
    />
  );
}