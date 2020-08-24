
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
  AsyncStorage,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-anchor-carousel';

const { width } = Dimensions.get('window');

const data = [
  {
    uri: require('./assets/images/aries.png'),
    icon: require('./assets/images/aries-icon.png'),
    sign: 'aries',
    nameSign: 'Овен',
    period: '21 марта – 20 апреля',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/taurus.png'),
    icon: require('./assets/images/taurus-icon.png'),
    sign: 'taurus',
    nameSign: 'Телец',
    period: '21 апреля – 21 мая',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/gemini.png'),
    icon: require('./assets/images/gemini-icon.png'),
    sign: 'gemini',
    nameSign: 'Близнецы',
    period: '22 мая – 21 июня',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/cancer.png'),
    icon: require('./assets/images/cancer-icon.png'),
    sign: 'cancer',
    nameSign: 'Рак',
    period: '22 июня – 22 июля',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/leo.png'),
    icon: require('./assets/images/leo-icon.png'),
    sign: 'leo',
    nameSign: 'Лев',
    period: '23 июля – 23 августа',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/virgo.png'),
    icon: require('./assets/images/virgo-icon.png'),
    sign: 'virgo',
    nameSign: 'Дева',
    period: '24 августа – 22 сентября',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/libra.png'),
    icon: require('./assets/images/libra-icon.png'),
    sign: 'libra',
    nameSign: 'Весы',
    period: '23 сентября – 22 октября',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/scorpio.png'),
    icon: require('./assets/images/scorpio-icon.png'),
    sign: 'scorpio',
    nameSign: 'Скорпион',
    period: '23 октября – 22 ноября',
    desc: 'Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет хранить секреты и ценит верность.'
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец',
    period: '23 ноября – 21 декабря',
    desc: 'Это фиксированный знак стихии воды. '
  },
  {
    uri: require('./assets/images/capricorn.png'),
    icon: require('./assets/images/capricorn-icon.png'),
    sign: 'capricorn',
    nameSign: 'Козерог',
    period: '22 декабря – 20 января',
    desc: 'Это фиксированный знак стихии воды. '
  },
  {
    uri: require('./assets/images/aquarius.png'),
    icon: require('./assets/images/aquarius-icon.png'),
    sign: 'aquarius',
    nameSign: 'Водолей',
    period: '21 января – 19 февраля',
    desc: 'Это фиксированный знак стихии воды. '
  },
  {
    uri: require('./assets/images/pisces.png'),
    icon: require('./assets/images/pisces-icon.png'),
    sign: 'pisces',
    nameSign: 'Рыбы',
    period: '20 февраля – 20 марта',
    desc: 'Это фиксированный знак стихии воды. '
  },
];
const horoscopes = {
  aries: '',
  taurus: '',
  gemini: '',
  cancer: '',
  leo: '',
  virgo: '',
  libra: '',
  scorpio: '',
  sagittarius: '',
  capricorn: '',
  aquarius: '',
  pisces: ''
}
const todayWord = 'сегодня';
const tomorrowWord = 'завтра';
const startIndex = 5;
const api = 'https://vk-irs.ru:4444/api';

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
      axios.post(api + "/addPushToken", params);

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
    shouldPlaySound: true,
    shouldSetBadge: true
  }),
});

setHash = async (value) => {
  await AsyncStorage.setItem(
    'horoscope_id',
    value
  );
};

getHash = async () => {
  let value = await AsyncStorage.getItem('horoscope_id');
  return value;
}

export default function App() {
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [sign, setSign] = useState(data[startIndex]);
  const [isReady, setIsReady] = useState(false);
  const [load, setLoad] = useState(false);
  const [id, setId] = useState(null);
  const [newcomer, setNewcomer] = useState(true);
  const [today, setToday] = useState(horoscopes);
  const [tomorrow, setTomorrow] = useState(horoscopes);
  const [day, setDay] = useState(true);
  const [openPanel, setPanel] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    
    getHash().then(id => {
      axios.post(api + "/getData", { id: id }).then(res => {
        setLoad(true);
        setId(res.data.id);
        setHash(res.data.id);
        setNewcomer(res.data.newcomer);
        setToday(res.data.today);
        setTomorrow(res.data.tomorrow);

        if (res.data.sign === 'aries' ||
        res.data.sign === 'taurus' ||
        res.data.sign === 'gemini' ||
        res.data.sign === 'cancer' ||
        res.data.sign === 'leo' ||
        res.data.sign === 'virgo' ||
        res.data.sign === 'libra' ||
        res.data.sign === 'scorpio' ||
        res.data.sign === 'sagittarius' ||
        res.data.sign === 'capricorn' ||
        res.data.sign === 'aquarius' ||
        res.data.sign === 'pisces') {
          let sign = data.find(data => data.sign === res.data.sign);
          setSign(sign);
        }

      });
    });
    
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


  if (!load) {
    return (
      <>
        <StatusBar hidden />
        <View style={ styles.loadingBody }>
          <LinearGradient
            colors={[ '#08051B', '#03082D' ]}
            style={ styles.bgGradient }
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={ styles.loading }>Загрузка...</Text>
        </View>
      </>
    );
  }


  if (newcomer) {
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
                onScrollEnd={ (sign) => setTimeout(() => setSign(sign), 40) }
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
              onPress={() => {
                let choose = data.find(data => data.sign === sign.sign);
                setNewcomer(false);
                setSign(choose);
                const params = { id: id, sign: sign.sign }
                axios.post(api + "/setSign", params);
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
        <View style={ styles.nav }>
          <Image style={ styles.icon } source={ require('./assets/favicon.png') }></Image>
          <Text style={ styles.accurateLogo }>Точный</Text>
          <Text style={ styles.horoscopeLogo }>гороскоп</Text>
          <TouchableOpacity style={ styles.chooseSign } onPress={ () => setPanel(!openPanel) }>
            <Text style={ styles.chooseText }>{ sign.nameSign }</Text>
            { openPanel
            ?
            <Image source={ require('./assets/images/close.png') }></Image>
            :
            <Image source={ require('./assets/images/open.png') }></Image>
            }
          </TouchableOpacity>
        </View>
        { openPanel &&
        <View style={ styles.panel }>
          { data.map((data, index) => (
            <TouchableOpacity
              key={ index }
              onPress={ () => {
                setPanel(false);
                setSign(data);
                const params = { id: id, sign: data.sign }
                axios.post(api + "/setSign", params);
              } }
            >
              <Text style={ styles.textPanel }>{ data.nameSign }</Text>
            </TouchableOpacity>
          )) }
        </View>
        }
        <ScrollView style={ styles.scrollView }>
          <View style={ styles.signBlock }>
            <Image source={ sign.uri }></Image>
            <Image style={ styles.signIcon } source={ sign.icon }></Image>
          </View>
          <View style={ styles.buttons }>
            <TouchableOpacity
              style={ styles.todayButton }
              onPress={() => setDay(true) }
            >
              { day
              ?
              <LinearGradient
                colors={[ '#0255D6', '#15FFE3' ]}
                style={ styles.buttonGradient }
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              ><Text style={ styles.dayText }>Сегодня</Text></LinearGradient>
              :
              <Text style={ styles.dayText }>Сегодня</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={ styles.tomorrowButton }
              onPress={() => setDay(false) }
            >
              { day
              ?
              <Text style={ styles.dayText }>Завтра</Text>
              :
              <LinearGradient
                colors={[ '#0255D6', '#15FFE3' ]}
                style={ styles.buttonGradient }
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              ><Text style={ styles.dayText }>Завтра</Text></LinearGradient>
              }
            </TouchableOpacity>
          </View>
          <Text style={ styles.horoscopeDay }>Гороскоп на { day ? todayWord : tomorrowWord }</Text>
          <Text style={ styles.horoscopeText }>{ day ? today[sign.sign] : tomorrow[sign.sign] }</Text>
        </ScrollView >
      </View>
    </>
  )

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
      ><Image source={ icon }></Image></ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(8,5,27)'
  },
  loadingBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  loading: {
    fontFamily: 'Nasalization',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  nav: {
    width: width,
    height: 83,
    position: 'absolute',
    left: 0,
    top: 0
  },
  scrollView: {
    width: width,
    position: 'absolute',
    top: 85,
    bottom: 0
  },
  icon: {
    position: 'absolute',
    left: 20,
    top: 21
  },
  accurateLogo: {
    position: 'absolute',
    left: 85,
    top: 20,
    fontFamily: 'Nasalization',
    fontSize: 18,
    textTransform: 'uppercase',
    color: '#D8A255'
  },
  horoscopeLogo: {
    position: 'absolute',
    left: 85,
    top: 40,
    fontFamily: 'Nasalization',
    fontSize: 18,
    textTransform: 'uppercase',
    color: '#ffffff'
  },
  chooseSign: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 22,
    paddingLeft: 20,
    paddingRight: 22,
    paddingBottom: 10,
    paddingTop: 10
  },
  chooseText: {
    fontFamily: 'GothamPro',
    fontSize: 14,
    color: '#ffffff',
    marginRight: 10
  },
  signBlock: {
    marginTop: 5,
    marginBottom: 5,
    width: width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signIcon: {
    position: 'absolute',
    left: 23,
    bottom: 23
  },
  buttons: {
    width: width,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 25
  },
  todayButton: {
    width: 131,
    height: 36,
    marginLeft: 23,
    backgroundColor: '#0D0E31',
    borderRadius: 10,
    alignItems: 'center'
  },
  tomorrowButton: {
    width: 131,
    height: 36,
    marginLeft: 10,
    backgroundColor: '#0D0E31',
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonGradient: {
    width: 131,
    height: 36,
    borderRadius: 10,
    alignItems: 'center'
  },
  dayText: {
    marginTop: 6,
    fontFamily: 'Nasalization',
    fontSize: 13,
    color: '#ffffff'
  },
  horoscopeDay: {
    marginLeft: 23,
    color: '#ffffff',
    fontFamily: 'Nasalization',
    fontSize: 19
  },
  horoscopeText: {
    margin: 23,
    fontFamily: 'GothamPro',
    fontSize: 13,
    lineHeight: 21,
    color: '#BCBED1'
  },
  panel: {
    zIndex: 1,
    position: 'absolute',
    right: 22,
    top: 71,
    backgroundColor: '#0D0E31',
    borderRadius: 7,
    paddingTop: 10,
    paddingBottom: 10
  },
  textPanel: {
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'GothamPro',
    fontSize: 14,
    lineHeight: 31,
    paddingRight: 20,
    paddingLeft: 45
  }
});