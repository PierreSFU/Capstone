import { useNavigation, useRoute } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import Geocoder from 'react-native-geocoding';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';
import PurchaseScreen from '../PurchaseScreen/PurchaseScreen';

Geocoder.init('AIzaSyBmjnH37clBAaGKN4R6Ji-qqUM3w8Lk2Js');

const CurrentBikeScreen = () => {
  const route = useRoute();
  // const { image, name, location, rating, price, time } = route.params;
  const image = require('../../../assets/bikeSelection/actual_Bike.jpg');
  const name = 'GT Aggressor';
  const rating = 4.7;
  const price = 4.21;
  let time = 1;
  const navigation = useNavigation();
  const [tasks, setTasks] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUserName] = React.useState(false);
  const [bikeInfo, setBikeInfo] = React.useState(undefined);
  const [endDate, setEndDate] = React.useState(undefined);
  const [bikeLocation, setBikeLocation] = React.useState('Loading');
  const [alertOccurred, setAlertOccurred] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);

  //RUN THIS AXIOS POST TO SEND PUSH NOTIFICATIONS
  function sendAlert() {
    console.log("enter alert");
    console.log(alertOccurred);
    console.log(alertTriggered);
    if (alertOccurred == false && alertTriggered == true) {
      // bikeInfo real value + bikeInfo has alert + alertOccurred only triggered once
      setAlertOccurred(true);
      setAlertTriggered(false);
      bikeInfo.alert = 0;
      editBike(bikeInfo);
      console.log("alert within\n\n\n\n\n\n\n");

      axios.post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: 'SwivelUserId',
        appId: 5009,
        appToken: 'zLGSh3bkdXv2IweqrDbIFD',
        title: 'Theft Detected',
        message: 'The Swivel motion detector has been triggered ',
      });
    }
  }

  function getMinutesBetweenDates(startDate, endDate) {
    if (startDate == undefined) {
      return 0;
    }
    endDate = new Date();
    startDate = new Date(startDate);
    const diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
  }

  Auth.currentUserInfo().then((userInfo) => {
    const { attributes = {} } = userInfo;
    setUserName(attributes.preferred_username);
  });

  useEffect(() => {
    const updateInterval = setInterval(() => {
      getBike();
      // sendAlert();
      if (bikeInfo != undefined) {
        Geocoder.from(bikeInfo.lat, bikeInfo.long)
          .catch((error) => console.log(error))
          .then((loc) => {
            setBikeLocation(
              loc.results[1].address_components[0].long_name +
                ' ' +
                loc.results[1].address_components[1].long_name +
                ', ' +
                loc.results[1].address_components[2].long_name
            );
            bikeInfo.location = bikeLocation;
            editBike(bikeInfo);
          });
      }
    }, 6000);
    return () => {
      window.clearInterval(updateInterval);
    };
  }, []);

  const unlockBike = () => {
    setIsLoading(true);
    fetch('https://iot.swivel.bike/helium/device/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setTasks(resp.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeTask = (task) => {
    fetch('http://iot.swivel.bike/control/complete/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actions: [task],
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setTasks(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
    // const temp = { username: 'test', rented: 'temp' };
    // setBikeInfo(temp);
    getBike();
  }

  if (bikeInfo == undefined) {
    return (
      <View style={currentBikeStyles.container}>
        <View style={headerFooterStyles.header}>{generateHeader()}</View>
        <Text> LOADING!</Text>
        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </View>
    );
  } else {
    return (
      <View style={currentBikeStyles.container}>
        <ImageBackground
          style={{ flex: 1 }}
          source={require('../../../assets/swivel_login_background.jpg')}
        >
          <View style={headerFooterStyles.header}>{generateHeader()}</View>

          <View style={headerFooterStyles.body}>
            <View style={currentBikeStyles.top}>
              <Image
                style={{ resizeMode: 'cover', height: '100%', width: '100%' }}
                source={image}
              />
            </View>

            <View style={currentBikeStyles.topText}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 26,
                  flex: 1,
                }}
              >
                {name}
              </Text>
            </View>
            {/* {console.log('\ntest' + test++)}
            {console.log('CBS locked: \n' + bikeInfo.lock_state)}
            {console.log('CBS rented: \n' + bikeInfo.rented)} */}
            <View style={currentBikeStyles.middle}>
              <View style={currentBikeStyles.textBoxColumn}>
                <Text style={currentBikeStyles.greyText}> Rental Time </Text>
                <Text style={currentBikeStyles.greyText}> Battery Life </Text>
                <Text style={currentBikeStyles.greyText}> Location </Text>
                <Text style={currentBikeStyles.greyText}> Delegator </Text>
                <Text style={currentBikeStyles.greyText}> Hourly Price </Text>
              </View>
              <View style={currentBikeStyles.textBoxColumn}>
                <Text style={currentBikeStyles.defaultText}>
                  {getMinutesBetweenDates(bikeInfo.time, endDate).toFixed(1)} Minutes
                </Text>
                <Text style={currentBikeStyles.defaultText}> {bikeInfo.battery} </Text>
                <Text style={currentBikeStyles.defaultText} ellipsizeMode="tail" numberOfLines={2}>
                  {bikeInfo.location}
                </Text>
                <Text style={currentBikeStyles.defaultText}>
                  {' '}
                  {bikeInfo.lock_state == true ? 'Locked' : 'Unlocked'}{' '}
                </Text>
                <Text style={currentBikeStyles.defaultText}> $ 4.21 </Text>
              </View>
            </View>

            <View style={currentBikeStyles.bottom}>
              <TouchableOpacity
                style={
                  bikeInfo.rented == true
                    ? currentBikeStyles.unlockButtonDisabled
                    : currentBikeStyles.unlockButton
                }
                onPress={() => {
                  if (username == bikeInfo.username && bikeInfo.lock_state == true) {
                    Alert.alert('Unlock Request Sent', 'Please wait while the delegator unlocks', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {},
                      },
                      {
                        text: 'Okay',
                        style: 'destructive',
                        onPress: () => {
                          unlockBike();
                          bikeInfo.lock_state = false; //if locked, lock_state = true
                          editBike(bikeInfo);
                          getBike();
                        },
                      },
                    ]);
                  } else {
                    Alert.alert(
                      'Locking the Bike',
                      'Please keep your fingers away from the lock and ensure that the bike is locked securely.',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                          onPress: () => {},
                        },
                        {
                          text: 'Okay',
                          style: 'destructive',
                          onPress: () => {
                            bikeInfo.lock_state = true; //if locked, lock_state = true
                            editBike(bikeInfo);
                            getBike();
                          },
                        },
                      ]
                    );
                  }
                }}
              >
                <Text style={currentBikeStyles.buttonUnlockDelegatorText}>
                  {bikeInfo.lock_state == true ? 'Unlock' : 'Lock'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  bikeInfo.lock_state == true
                    ? currentBikeStyles.unlockButtonDisabled
                    : currentBikeStyles.unlockButton
                }
                onPress={() => {
                  if (bikeInfo.rented == true) {
                    Alert.alert('Pay for the Bike', 'Thank you for using Swivel!', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {},
                      },
                      {
                        text: 'Okay',
                        style: 'destructive',
                        onPress: () => {
                          bikeInfo.username = '';
                          bikeInfo.rented = false;
                          editBike(bikeInfo);
                          getBike();
                          setAlertTriggered(true);
                          time = getMinutesBetweenDates(bikeInfo.time, new Date());
                          navigation.navigate('Purchase', {
                            image,
                            name,
                            location: bikeInfo.location,
                            rating,
                            price,
                            time,
                          });
                        },
                      },
                    ]);
                  } else if (bikeInfo.rented == false) {
                    Alert.alert('Bike is Available to Rent', 'Would you like to rent it?', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {},
                      },
                      {
                        text: 'Okay',
                        style: 'destructive',
                        onPress: () => {
                          console.log('Rented');
                          bikeInfo.username = username;
                          bikeInfo.rented = true;
                          bikeInfo.time = new Date();
                          editBike(bikeInfo);
                          getBike();
                        },
                      },
                    ]);
                  }
                }}
              >
                <Text style={currentBikeStyles.buttonUnlockDelegatorText}>
                  {bikeInfo.rented == false ? 'Rent' : 'Pay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={headerFooterStyles.footer}>{generateFooter()}</View>
        </ImageBackground>
      </View>
    );
  }
};

const currentBikeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff',
  },
  //Image
  top: {
    flex: 0.4,
    backgroundColor: '#dff',
  },
  topText: {
    flex: 0.08,
    backgroundColor: '#Fff',
  },
  // Text
  middle: {
    flex: 0.42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  // Button
  bottom: {
    flex: 0.1,
    flexDirection: 'row',
    backgroundColor: '#eff',
  },

  defaultText: {
    flex: 1,
    borderWidth: 1,
    borderLeftWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'stretch',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
  },
  textBoxRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  textBoxColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },

  buttonUnlockDelegator: {
    flex: 1,
    justifyContent: 'center',
    top: '0%',
    backgroundColor: '#B4FF39',
  },

  buttonUnlockDelegatorText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: '5%',
    opacity: 1,
    flex: 1,
  },
  greyText: {
    fontWeight: 'bold',
    color: '#BFC0BD',
    fontSize: 22,
    borderWidth: 1,
    borderRightWidth: 0.5,
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#BFC0BD',
    color: '#aaa',
    flex: 1,
    borderWidth: 1,
  },

  unlockButtonDisabled: {
    backgroundColor: '#B4FF39',
    color: '#000',
    flex: 1,
    borderWidth: 1,
  },
});
export default CurrentBikeScreen;
