import Constants from 'expo-constants';
import * as Amplitude from 'expo-analytics-amplitude';
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
import { AdMobRewarded } from 'expo-ads-admob';
const idBaner = 'ca-app-pub-6050546095426315/9026709170';
// const idBaner = 'ca-app-pub-3940256099942544/5224354917'; // тест

Amplitude.initialize('89183eb6fc3a00f6789298af46314583');
const { width } = Dimensions.get('window');

const data = [
  {
    uri: require('./assets/images/aries.png'),
    icon: require('./assets/images/aries-icon.png'),
    sign: 'aries',
    nameSign: 'Овен',
    period: '21 марта – 20 апреля',
    desc: 'Внутренние силы и не убиваемый оптимизм делает из Овнов непобедимых борцов. Их утомляет однообразие, они склонны менять хобби, работу и интересы. Пламенная любовь и испепеляющая страсть тоже не вечны – со временем хочется сменить партнера.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/taurus.png'),
    icon: require('./assets/images/taurus-icon.png'),
    sign: 'taurus',
    nameSign: 'Телец',
    period: '21 апреля – 21 мая',
    desc: 'Каждый юный Телец приходит в этот мир, чтобы сделать его красивее и счастливее. Такие люди прилагают усилия, чтобы улучшать все, что им подвластно. Но эти светлые и добродушные люди становятся жёсткими и агрессивными, если вы обидите тех, кто им дорог.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/gemini.png'),
    icon: require('./assets/images/gemini-icon.png'),
    sign: 'gemini',
    nameSign: 'Близнецы',
    period: '22 мая – 21 июня',
    desc: 'У рожденных под знаком Близнецов будто тысяча лиц, они переменчивы и непостоянны. Но именно поэтому с ними так интересно и увлекательно. Близнецы уничтожат любую рутину и превратят жизнь в захватывающий спектакль.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/cancer.png'),
    icon: require('./assets/images/cancer-icon.png'),
    sign: 'cancer',
    nameSign: 'Рак',
    period: '22 июня – 22 июля',
    desc: 'Раки далеки от земных забот – душевные порывы и возвышенные чувства для них важнее всего. Но при этом они умеют зарабатывать деньги и окружают себя красивыми вещами. Близких и любимых они оберегают, переставая витать в облаках.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/leo.png'),
    icon: require('./assets/images/leo-icon.png'),
    sign: 'leo',
    nameSign: 'Лев',
    period: '23 июля – 23 августа',
    desc: 'На любом мероприятии Льва легко опознать – именно он окружен всеобщим вниманием, благодаря своему шарму. Благородство, смелость и изысканный вкус отличают его от окружающих. Но свое ранимое сердце от умело скрывает.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/virgo.png'),
    icon: require('./assets/images/virgo-icon.png'),
    sign: 'virgo',
    nameSign: 'Дева',
    period: '24 августа – 22 сентября',
    desc: 'Под знаком Девы рождаются люди, одаренные интеллектом: они умеют просчитывать ситуацию и обеспечивать себе победу. Любовные переживания и эмоции будут отброшены, если для Девы это невыгодно. Рассудок позволит построить счастливую семью, но и в одиночестве эти люди вполне счастливы.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/libra.png'),
    icon: require('./assets/images/libra-icon.png'),
    sign: 'libra',
    nameSign: 'Весы',
    period: '23 сентября – 22 октября',
    desc: 'Весы кажутся нерешительными, но на самом деле они просто взвешивают множество вариантов развития каждой ситуации, чтобы сделать правильный выбор. Добродушие и хорошее воспитание делают Весов приятными собеседниками и партнерами.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/scorpio.png'),
    icon: require('./assets/images/scorpio-icon.png'),
    sign: 'scorpio',
    nameSign: 'Скорпион',
    period: '23 октября – 22 ноября',
    desc: 'Скорпионы легко очаруют любого, но к ним непросто будет найти подход. Привлекательность и многогранность помогают добиться успеха, но Скорпионы совершенно не корыстны. Череда романов – всего лишь способ борьбы с одиночеством.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/sagittarius.png'),
    icon: require('./assets/images/sagittarius-icon.png'),
    sign: 'sagittarius',
    nameSign: 'Стрелец',
    period: '23 ноября – 21 декабря',
    desc: 'Стрелец азартен и легко поддается эмоциональным порывам, чувствам. Даже за сложное дело он примется с интересом и энтузиазмом. Представители знака легко находят тех, кто от них без ума, а потому окружены чуткими и понимающими людьми.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/capricorn.png'),
    icon: require('./assets/images/capricorn-icon.png'),
    sign: 'capricorn',
    nameSign: 'Козерог',
    period: '22 декабря – 20 января',
    desc: 'Взгляд на мир без розовых очков и трудолюбие помогают Козерогам справляться с любыми сложностями и завоевывать все новых цели. Козерог говорит «нет» неоправданному оптимизму и из-за этого иногда видит мир мрачнее, чем он есть в реальности.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/aquarius.png'),
    icon: require('./assets/images/aquarius-icon.png'),
    sign: 'aquarius',
    nameSign: 'Водолей',
    period: '21 января – 19 февраля',
    desc: 'Водолеев непросто понять даже близким людям, ведь представители знака самодостаточны и таинственны и привносят нотки творчества в любое дело. Пока окружающие будут долго искать решение, Водолей найдет его мгновенно, используя интуицию и жизненный опыт.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/pisces.png'),
    icon: require('./assets/images/pisces-icon.png'),
    sign: 'pisces',
    nameSign: 'Рыбы',
    period: '20 февраля – 20 марта',
    desc: 'Рыбы обычно спокойны, романтические чувства или грусть иногда будоражат спокойные воды их мира, но все проходит. Рыбам нужна поддержка и они легко её найдут, благодаря собственной душевной теплоте.',
    todayAds: false,
    tomorrowAds: false
  },
  {
    uri: require('./assets/images/ophiuchus.png'),
    icon: require('./assets/images/ophiuchus-icon.png'),
    sign: 'ophiuchus',
    nameSign: 'Змееносец',
    period: '30 ноября - 16 декабря',
    desc: 'Змееносец рожден между 30 ноября и 16 декабря. Люди этого знака обладают сильной интуицией и даром убеждения, но используют их только во благо. Трепетно заботятся о близких и любимых, часто испытывают противоречивые эмоции.',
    todayAds: false,
    tomorrowAds: false
  }
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
  pisces: '',
  ophiuchus: ''
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






export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      expoPushToken: '',
      sign: data[startIndex],
      isReady: false,
      load: false,
      id: null,
      newcomer: true,
      today: horoscopes,
      tomorrow: horoscopes,
      day: true,
      openPanel: false,
      ads: true
    }
  }

  componentDidMount() {

    AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {

      Amplitude.logEvent('failAds', {});
      this.setState({ ads: true });

    });

    AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', () => {

      Amplitude.logEvent('successAds', {});

      let sign = this.state.sign;
      let counter = this.state.counter + 1;

      if (this.state.day) sign.todayAds = true;
      else sign.tomorrowAds = true;
      
      this.setState({
        ads: true,
        sign: sign,
        counter: counter
      });

    });
    
    getHash().then(id => {
      axios.post(api + "/getData", { id: id }).then(res => {

        setHash(res.data.id);

        this.setState({
          load: true,
          id: res.data.id,
          newcomer: res.data.newcomer,
          today: res.data.today,
          tomorrow: res.data.tomorrow
        })

        Amplitude.setUserId(res.data.id);
        Amplitude.logEvent('enter', {
          timestamp: res.data.timestamp
        });

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
        res.data.sign === 'pisces' ||
        res.data.sign === 'ophiuchus') {
          let sign = data.find(data => data.sign === res.data.sign);
          this.setState({ sign: sign });
        }

      });
    });
    
    registerForPushNotificationsAsync().then(token => {
      this.setState({ expoPushToken: token });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  }

  componentWillUnmount() {}


  async showAds() {

    this.setState({ ads: false });
               
    let ready = true;
    await AdMobRewarded.setAdUnitID(idBaner);
    await AdMobRewarded.requestAdAsync().catch(() => {
      ready = false;
    });
  
    if (ready) {

      await AdMobRewarded.showAdAsync();

    } else {
      
      let sign = this.state.sign;
      let counter = this.state.counter + 1;

      if (this.state.day) sign.todayAds = true;
      else sign.tomorrowAds = true;
      
      this.setState({
        ads: true,
        sign: sign,
        counter: counter
      });

    }

  }


  render() {

    if (!this.state.isReady) {
      return (
        <AppLoading 
          startAsync={ loadApplication } 
          onError={ err => console.log(err) }
          onFinish={ () => this.setState({ isReady: true}) }
        />
      )
    }

    if (!this.state.load) {
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


    if (this.state.newcomer) {
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
                  onScrollEnd={ (sign) => setTimeout(() => {
                    this.setState({ sign: sign });
                  }, 40) }
                />
              </View>
              <View style={ styles.description }>
                <Text style={ styles.nameSign }>{ this.state.sign.nameSign }</Text>
                <Text style={ styles.period }>{ this.state.sign.period }</Text>
                <Text style={ styles.desc }>{ this.state.sign.desc }</Text>
              </View>
            </View>
            <View style={ styles.footer }>
              <TouchableOpacity
                style={ styles.touchButton }
                onPress={() => {

                  Amplitude.logEvent('continue', {});

                  let choose = data.find(data => data.sign === this.state.sign.sign);

                  this.setState({
                    newcomer: false,
                    sign: choose
                  });
                  const params = {
                    id: this.state.id,
                    sign: this.state.sign.sign
                  }
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
            <TouchableOpacity style={ styles.chooseSign } onPress={ () => this.setState({ openPanel: !this.state.openPanel }) }>
              <Text style={ styles.chooseText }>{ this.state.sign.nameSign }</Text>
              { this.state.openPanel
              ?
              <Image source={ require('./assets/images/close.png') }></Image>
              :
              <Image source={ require('./assets/images/open.png') }></Image>
              }
            </TouchableOpacity>
          </View>
          { this.state.openPanel &&
          <View style={ styles.panel }>
            { data.map((data, index) => (
              <TouchableOpacity
                key={ index }
                onPress={ () => {

                  this.setState({
                    openPanel: false,
                    sign: data
                  });

                  const params = {
                    id: this.state.id,
                    sign: data.sign
                  }
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
              <Image source={ this.state.sign.uri }></Image>
              <Image style={ styles.signIcon } source={ this.state.sign.icon }></Image>
            </View>
            <View style={ styles.buttons }>
              <TouchableOpacity
                style={ styles.todayButton }
                onPress={ () => {

                  this.setState({
                    ads: true,
                    day: true
                  });

                } }
              >
                { this.state.day
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
                onPress={ () => {

                  this.setState({
                    ads: true,
                    day: false
                  });

                } }
              >
                { this.state.day
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
            <Text style={ styles.horoscopeDay }>Гороскоп на { this.state.day ? todayWord : tomorrowWord }</Text>

            { /* без рекламы */ }
            {/* <Text style={ styles.horoscopeText }>
              { this.state.day && this.state.today[this.state.sign.sign] }
              { !this.state.day && this.state.tomorrow[this.state.sign.sign] }
            </Text> */}

            { /* с рекламой */ }
            <Text style={ styles.horoscopeText }>
              { this.state.day && this.state.sign.todayAds && this.state.today[this.state.sign.sign] }
              { !this.state.day && this.state.sign.tomorrowAds && this.state.tomorrow[this.state.sign.sign] }
              { this.state.day && !this.state.sign.todayAds && this.state.today[this.state.sign.sign].substr(0, 100) + '...' }
              { !this.state.day && !this.state.sign.tomorrowAds && this.state.tomorrow[this.state.sign.sign].substr(0, 100) + '...' }
            </Text>
            { this.state.day && !this.state.sign.todayAds && this.state.ads &&
            <TouchableOpacity
              onPress={ async () => this.showAds() }
              >
              <Text style={ styles.ads }>Посмотри рекламу и продолжи читать</Text>
            </TouchableOpacity>
            }
            { !this.state.day && !this.state.sign.tomorrowAds && this.state.ads &&
            <TouchableOpacity
              onPress={ async () => this.showAds() }
              >
              <Text style={ styles.ads }>Посмотри рекламу и продолжи читать</Text>
            </TouchableOpacity>
            }
  
          </ScrollView>
        </View>
      </>
    )
    
  }

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
  ads: {
    margin: 23,
    marginTop: -13,
    fontFamily: 'GothamPro',
    fontSize: 13,
    lineHeight: 21,
    textDecorationLine: 'underline',
    color: '#15FFE3'
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