import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';


const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
const VisaScreen = () => {
  const route = useRoute();
  const { totalPrice, name } = route.params;
  const [cardnumber, setCardnumber] = useState('');
  const [fullName, setFullname] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [bikeInfo, setBikeInfo] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [alertOccurred, setAlertOccurred] = useState(false);

  console.log(name);
  const navigation = useNavigation();


  function sendAlert() {
    console.log('enter alert');
    console.log(alertOccurred);
    if (alertOccurred == false) {
      // bikeInfo real value + bikeInfo has alert + alertOccurred only triggered once
      setAlertOccurred(true);
      bikeInfo.alert = 0;
      editBike(bikeInfo);
      console.log('\n\n\nALERTTTT\n\n\n');

      axios.post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: 'SwivelUserId',
        appId: 5009,
        appToken: 'zLGSh3bkdXv2IweqrDbIFD',
        title: 'Theft Detected',
        message: 'The Swivel motion detector has been triggered ',
      });
    }
  }
  async function makeRequest() {
    console.log('DELAY WAITING\n\n');

    await delay(15000);
    sendAlert();

    console.log('DELAY COMPLETE\n\n');
  }

  const getBike = () => {
    fetch('https://iot.swivel.bike/helium/app')
      .then((resp) => resp.json())
      .then((resp) => {
        setBikeInfo(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editBike = (task) => {
    setIsLoading(true);
    fetch('https://iot.swivel.bike/helium/app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setBikeInfo(resp.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (bikeInfo == undefined) {
    getBike();
    console.log('Test:' + bikeInfo);
  }

  if (bikeInfo == undefined) {
    return (
      <View>
        <Text> Loading...!</Text>
      </View>
    );
  } else {
    return (
      <View style={visaStyles.container}>
        <ImageBackground
          style={{ flex: 1 }}
          source={require('../../../assets/swivel_login_background.jpg')}
        >
          <View style={headerFooterStyles.header}>{generateHeader()}</View>
          <View style={headerFooterStyles.body}>
            <View style={visaStyles.lower_background}>
              <View style={visaStyles.top}>
                <Image
                  style={{ resizeMode: 'contain', height: '100%', width: '80%' }}
                  source={require('../../../assets/credit_card2.jpg')}
                />
              </View>
              <View style={visaStyles.middle}>
                <TextInput
                  style={visaStyles.TextInput1}
                  placeholder="Card Number"
                  placeholderTextColor="#003f5c"
                  keyboardType="numeric"
                  onChangeText={(cardnumber) => setCardnumber(cardnumber)}
                />

                <TextInput
                  style={visaStyles.TextInput2}
                  placeholder="Card Holder Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={(fullName) => setFullname(fullName)}
                />

                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      height: 50,
                      borderColor: '#474343',
                      borderWidth: 1,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 20,
                    }}
                    keyboardType="numeric"
                    placeholder="MM"
                    placeholderTextColor="#003f5c"
                    onChangeText={(month) => setMonth(month)}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginRight: 10,
                      height: 50,
                      borderColor: '#474343',
                      borderWidth: 1,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 20,
                    }}
                    keyboardType="numeric"
                    placeholder="YY"
                    placeholderTextColor="#003f5c"
                    onChangeText={(year) => setYear(year)}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      marginRight: 10,
                      height: 50,
                      borderColor: '#474343',
                      borderWidth: 1,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 20,
                    }}
                    keyboardType="numeric"
                    placeholder="CVV"
                    placeholderTextColor="#003f5c"
                    onChangeText={(cvv) => setCvv(cvv)}
                  />
                </View>
                <Text style={visaStyles.totalPrice}>
                  $ {totalPrice.toFixed(2)} {console.log(bikeInfo.name)}
                </Text>
                {/* {console.log(totalPrice)} */}
              </View>

              <View style={visaStyles.bottom}>
                <TouchableOpacity
                  style={visaStyles.PayButton}
                  onPress={() => {
                    Alert.alert('Thank you', 'Payment Succesful!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          console.log('User Payed');
                          navigation.navigate('Map');
                          makeRequest();
                        },
                        // name =
                      },
                    ]);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#000000',
                      fontSize: 26,
                      textAlign: 'left',
                      // fontWeight: 'bold',
                    }}
                  >
                    Pay Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={headerFooterStyles.footer}>{generateFooter()}</View>
        </ImageBackground>
      </View>
    );
  }
};

const visaStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    // padding: 20,
    margin: 0,
  },
  top: {
    flex: 0.55,
    backgroundColor: 'white',
    // justifyContent: 'flex-end',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // paddingTop: 40,
    // marginTop: 60,
    // marginHorizontal: 0,
    // marginBottom: 60,
    border: 'none',
  },
  middle: {
    flex: 0.35,
    // borderWidth: 1,
    backgroundColor: 'white',
  },

  bottom: {
    flex: 0.1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: 'green',
    borderWidth: 1,
    // marginHorizontal: 15,
    // marginBottom: '5%',
    // borderRadius: 20,
  },

  lower_background: {
    flex: 1,
    backgroundColor: 'white',
  },
  PayButton: {
    flex: 1,
    backgroundColor: '#B4FF39',
    color: '#000',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 20,
  },

  TextInput1: {
    fontSize: 20,
    marginTop: 15,
    marginHorizontal: 15,
    textAlign: 'center',
    justifyContent: 'flex-end',
    borderColor: '#474343',
    borderRadius: 10,
    borderWidth: 1,
  },

  TextInput2: {
    fontSize: 20,
    margin: 15,
    textAlign: 'center',
    justifyContent: 'flex-end',
    borderColor: '#474343',
    borderRadius: 10,
    borderWidth: 1,
  },

  totalPrice: {
    fontSize: 36,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    justifyContent: 'flex-end',
    color: '#B4FF39',
    fontWeight: 'bold',
    marginTop: '3%',
  },
});

export default VisaScreen;
