import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';

const { width } = Dimensions.get('window');

const data = [
  {
    uri: 'https://i.imgur.com/GImvG4q.jpg'
  },
  {
    uri: 'https://i.imgur.com/Pz2WYAc.jpg'
  },
  {
    uri: 'https://i.imgur.com/IGRuEAa.jpg'
  },
  {
    uri: 'https://i.imgur.com/fRGHItn.jpg'
  },
  {
    uri: 'https://i.imgur.com/WmenvXr.jpg'
  }
];

function renderItem({ item, index }) {
  const { uri } = item;
  return (
    <TouchableOpacity
      activeOpacity={ 1 }
      style={ styles.item }
      onPress={() => {
        alert('индекс из массива ' + index);
      }}
    >
      <ImageBackground
        source={{ uri: uri }}
        style={ styles.imageBackground }
      >
      </ImageBackground>
    </TouchableOpacity>
  );
};

function onScrollEnd(sign) {
  alert(sign.uri);
}

export default function ImageCarousel() {

  return (
    <Carousel
      style={ styles.carousel }
      data={ data }
      renderItem={ renderItem }
      itemWidth={ 0.7 * width }
      inActiveOpacity={ 0.3 }
      containerWidth={ width }
      initialIndex={ 1 }
      onScrollEnd={ (index) => onScrollEnd(index) }
    />
  );

}

const styles = StyleSheet.create({
  carousel: {
    flex: 1
  },
  item: {
    flex: 1
  },
  imageBackground: {
    flex: 2
  }
});