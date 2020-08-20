
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-anchor-carousel';

const { width } = Dimensions.get('window');

const data = [
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец 1',
    period: '23 Ноября – 21 Декабря',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец 2',
    period: '23 Ноября – 21 Декабря',
    desc: 'Это фиксированный знак стихии воды. '
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец 3',
    period: '23 Ноября – 21 Декабря',
    desc: 'Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец 4',
    period: '23 Ноября – 21 Декабря',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец 5',
    period: '23 Ноября – 21 Декабря',
    desc: 'Это фиксированный знак стихии воды.'
  }
];
const startIndex = 1;

async function loadApplication() {
  await Font.loadAsync({
    'Nasalization': require('./assets/fonts/Nasalization.otf'),
    'GothamPro': require('./assets/fonts/GothamPro.ttf')
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {

      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;

    }

    if (finalStatus === 'granted') {

      token = (await Notifications.getExpoPushTokenAsync()).data;
      const params = { token: token }
      axios.post("https://vk-irs.ru:4444/api/addPushToken", params);;

    }

  }

  if (Platform.OS === 'android') {

    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      sound: true,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

  }

  return token;

}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

setHash = async () => {
  await AsyncStorage.setItem(
    'horoscope_id',
    'sdfsdfsdfsdfsdfsdf'
  );
};

getHash = async () => {
  const value = await AsyncStorage.getItem('horoscope_id');
  if (value !== null) {
    alert(value);
  } else [
    alert('хэша нет')
  ]
};

export default function App() {
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [sign, setSign] = useState(data[startIndex]);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    
    getHash();
    
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  }, []);

  if (!isReady) {
    return (
      <AppLoading 
        startAsync={ loadApplication } 
        onError={ err => console.log(err) }
        onFinish={ () => setIsReady(true) }
      />
    )
  }

  return (
    <>
      <StatusBar hidden />
      <View style={ styles.body }>
        <LinearGradient
          colors={[ '#08051B', '#03082D' ]}
          style={ styles.bgGradient }
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={ styles.header }>
          <Text style={ styles.accurateLabel }>Точный</Text>
          <Text style={ styles.horoscopeLabel }>гороскоп</Text>
          <View style={ styles.cookieBlock }>
            <Text style={ styles.cookieLabel }>От создателей печеньки</Text>
            <Image source={ require('./assets/images/cookie.png') } />
          </View>
        </View>

        <View style={ styles.content }>
          
          <View style={ styles.carouselContainer }>
            <Carousel
              style={ styles.carousel }
              data={ data }
              renderItem={ renderItem }
              itemWidth={ 0.7 * width }
              inActiveOpacity={ 0.3 }
              containerWidth={ width }
              initialIndex={ startIndex }
              onScrollEnd={ (sign) => setSign(sign) }
            />
          </View>

          <View style={ styles.description }>
            <Text style={ styles.nameSign }>{ sign.nameSign }</Text>
            <Text style={ styles.period }>{ sign.period }</Text>
            <Text style={ styles.desc }>{ sign.desc }</Text>
          </View>

        </View>

        <View style={ styles.footer }>
          <TouchableOpacity
            style={ styles.touchButton }
            onPress={ () => {
              setHash();
            }}>
            <LinearGradient
              colors={[ '#0255D6', '#15FFE3' ]}
              style={ styles.bigButton }
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={ styles.bigButtonText }>Далее</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>


      </View>
    </>
  );
}

function renderItem({ item }) {
  const { uri, icon } = item;
  return (
    <TouchableOpacity
      activeOpacity={ 1 }
      style={ styles.carousel }
    >
      <ImageBackground
        source={ uri }
        style={ styles.imageBackground }
      >
        <Image source={ icon }></Image>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(8,5,27)'
  },
  bgGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },

  header: {
    alignItems: 'center',
    width: width,
    position: 'relative',
    height: 160
  },
  accurateLabel: {
    position: 'absolute',
    top: 24,
    fontFamily: 'Nasalization',
    fontSize: 32,
    color: '#D8A255',
    textTransform: 'uppercase'
  },
  horoscopeLabel: {
    position: 'absolute',
    top: 60,
    fontFamily: 'Nasalization',
    fontSize: 32,
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  cookieBlock: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 125,
  },
  cookieLabel: {
    fontFamily: 'GothamPro',
    fontSize: 13,
    color: '#A0A3C0',
    marginRight: 7
  },

  content: {
    width: width,
    flex: 1
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'center',
    width: width,
    height: 110
  },
  touchButton: {
    alignItems: 'center',
    width: width,
  },
  bigButton: {
    width: '90%',
    height: 43,
    alignItems: 'center',
    paddingTop: 6,
    borderRadius: 10
  },
  bigButtonText: {
    fontFamily: 'Nasalization',
    fontSize: 15,
    color: '#ffffff',
  },
  carouselContainer: { 
    width: width,
    flex: 1
  },
  carousel: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  description: {
    width: width
  },
  nameSign: {
    marginTop: 10,
    fontFamily: 'Nasalization',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  period: {
    fontFamily: 'Nasalization',
    textAlign: 'center',
    fontSize: 14,
    color: '#1968E4',
    marginTop: 6,
  },
  desc: {
    fontFamily: 'GothamPro',
    color: '#BCBED1',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10
  }
});