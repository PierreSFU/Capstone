import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  Button,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';

const defaultHeight = 125;
const defaultWidth = 125;
const masterArray = defaultBikes();

const GarageScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const [defaultBike, defaultPrice] = ['null', 666];
  const [bikeName, onChangeBikeName] = useState('null');
  const [price, onChangePrice] = useState(666);

  return (
    <View style={bikeGarageStyles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        <View style={headerFooterStyles.header}>{generateHeader()}</View>

        <View style={headerFooterStyles.body}>
          <View style={bikeGarageStyles.top}>
            <ScrollView style={bikeGarageStyles.scrollView}>
              {bikeGeneration(masterArray)}
            </ScrollView>
          </View>

          <View style={bikeGarageStyles.bottom}>
            <TouchableOpacity
              style={bikeGarageStyles.buttonAddBike}
              onPress={() => {
                setShowModal(!showModal);
              }}
            >
              <View style={bikeGarageStyles.buttonAddBike}>
                <Text style={bikeGarageStyles.buttonAddBikeText}> Add Bike </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            justifyContent="center"
            animationType="slide"
            transparent
            visible={showModal}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}
          >
            <View style={styles.modal}>
              <TextInput
                style={styles.textBox}
                onChangeText={onChangeBikeName}
                placeholder="Bike Name"
                keyboardType="ascii-capable"
              />
              <TextInput
                style={styles.textBox}
                onChangeText={onChangePrice}
                placeholder="Hourly Price"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={bikeGarageStyles.button}
                onPress={() => {
                  if (bikeName == 'null' || price == '666') {
                    console.log('FAILEDDDD');
                  } else {
                    setShowModal(!showModal);
                    masterArray.push(userInput(bikeName, price));

                    onChangeBikeName(defaultBike);
                    onChangePrice(defaultPrice);
                  }
                }}
              >
                <View style={bikeGarageStyles.buttonAddBike}>
                  <Text style={bikeGarageStyles.buttonAddBikeText}> Add Listing </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          {/*Updating the state to make Modal Visible*/}
        </View>

        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </ImageBackground>
    </View>
  );
};

function defaultBikes() {
  const bikeData1 = [
    {
      bikeName: 'Townie Original 7D',
      location: 'Burrard St, Vancouver, BC, Canada',
      rating: '4.7/5',
      price: '4.60',
      time: '5d 2h',
      image: require('../../../assets/bikeSelection/bike1.jpg'),
    },
  ];
  const bikeData2 = [
    {
      bikeName: 'Domane+ ALR',
      location: 'Westridge, Burnaby, BC, Canada',
      rating: '4.1/5',
      price: '3.61',
      time: '3d 5h',
      image: require('../../../assets/bikeSelection/bike2.jpg'),
    },
  ];
  const bikeData3 = [
    {
      bikeName: 'Boone 6',
      location: 'Nelson St, Vancouver, BC, Canada',
      rating: '4.9/5',
      price: '6.81',
      time: '4d 5h',
      image: require('../../../assets/bikeSelection/bike3.jpg'),
    },
  ];
  const bikeData4 = [
    {
      bikeName: 'Checkpoint ALR 5 Driftless',
      location: 'Science Rd, Burnaby, BC, Canada',
      rating: '3.7/5',
      price: '12.52',
      time: '2d 1h',
      image: require('../../../assets/bikeSelection/bike4.jpg'),
    },
  ];
  const bikeData5 = [
    {
      bikeName: 'Emonda SLR 9 eTap',
      location: '52a St, Delta, BC, Canada',
      rating: '4.2/5',
      price: '2.24',
      time: '6d 9h',
      image: require('../../../assets/bikeSelection/bike5.png'),
    },
  ];
  const masterArray = [bikeData1, bikeData2, bikeData3, bikeData4, bikeData5];
  return masterArray;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function userInput(bikeName, price) {
  const rating = '{getRandomInt(max)}';
  const bikeData = [
    {
      bikeName,
      location: 'Delegator Disconnected',
      rating: 'TBD',
      price,
      time: getRandomInt(7) + 'd ' + getRandomInt(23) + 'h',
      image: require('../../../assets/bikeSelection/bike1.jpg'),
    },
  ];

  return bikeData;
}

function bikeGeneration(masterArray) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = useNavigation();
  const numBikes = masterArray.length;

  const views = [];
  for (let i = 0; i < numBikes; i++) {
    views[i] = masterArray[i].map((arr) => (
      <View style={bikeGarageStyles.bikeBox} key={arr.image}>
        <Image style={bikeGarageStyles.bikeImage} source={arr.image} />
        <View style={bikeGarageStyles.bikeTextBox}>
          <View style={bikeGarageStyles.bikeTextBoxInnerTop}>
            <Text style={bikeGarageStyles.bikeTextTop}>{arr.bikeName}</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              allowFontScaling
              style={bikeGarageStyles.bikeTextMiddle}
            >
              {arr.location}
            </Text>
          </View>

          <View style={bikeGarageStyles.bikeTextBoxInnerBottom}>
            <Image
              style={bikeGarageStyles.bikeInnerImage}
              source={require('../../../assets/star.png')}
            />
            <Text style={bikeGarageStyles.bikeTextBottom}>{arr.rating}</Text>
            <Image
              style={bikeGarageStyles.bikeInnerImagePrice}
              source={require('../../../assets/dollar2.png')}
            />
            <Text style={bikeGarageStyles.bikeTextBottomPrice}>{arr.price}</Text>
            <Image
              style={bikeGarageStyles.bikeInnerImage}
              source={require('../../../assets/battery.png')}
            />
            <Text style={bikeGarageStyles.bikeTextBottom}>{arr.time}</Text>
          </View>

          <View style={bikeGarageStyles.bottomButtonInner}>
            <TouchableOpacity
              style={bikeGarageStyles.button}
              onPress={() => {
                Alert.alert('In Progress', 'Bike Edited!', [
                  { text: 'OK', onPress: () => console.log('Bike Added') },
                ]);
              }}
            >
              <View style={bikeGarageStyles.button}>
                <Text style={bikeGarageStyles.buttonText}> Edit </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={bikeGarageStyles.button}
              onPress={() => {
                Alert.alert('In Progress', 'Bike Removed!', [
                  { text: 'OK', onPress: () => console.log('Bike Removed') },
                ]);
              }}
            >
              <View style={bikeGarageStyles.button}>
                <Text style={bikeGarageStyles.buttonText}> Remove </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  }
  return views;
}


const bikeGarageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: '#fff',
    margin: 0,
  },
  top: {
    flex: 0.9,
    backgroundColor: 'green',
    // opacity: 0.3,
    borderWidth: 1,
  },
  bottom: {
    flex: 0.1,
    // backgroundColor: 'cyan',
    borderWidth: 1,
  },

  bikeBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#2a4944',
    // backgroundColor: 'white',
    borderWidth: 0.5,
  },

  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: 50,
  },

  bikeImage: {
    resizeMode: 'cover',
    height: defaultHeight,
    width: defaultWidth,
    borderRadius: 25,
    marginVertical: '5%',
    marginLeft: '5%',
    marginRight: '3%',
  },

  bikeTextBox: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '6%',
    paddingBottom: '4%',
    // borderColor: '#7a4944',
    // borderWidth: 1,
    // backgroundColor: 'white',
  },

  bikeTextBoxInnerTop: {
    flex: 0.1,
    borderColor: '#7a4944',
    // borderWidth: 1,
    // backgroundColor: 'green',
  },
  bikeTextBoxInnerBottom: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#7a4944',
    // borderWidth: 1,
    // backgroundColor: 'purple',
  },
  bikeInnerImage: {
    resizeMode: 'contain',
    height: '50%',
    width: '10%',
  },
  bikeInnerImagePrice: {
    resizeMode: 'contain',
    height: '50%',
    width: '10%',
    paddingLeft: 30,
  },
  bottomButtonInner: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
    // borderWidth: 1,
    marginRight: '3%',
  },

  bikeTextTop: {
    flex: 0.05,
    fontSize: 18,
    justifyContent: 'flex-end',
    color: '#000000',
    fontWeight: 'bold',
    // borderWidth: 1,
  },
  bikeTextMiddle: {
    flex: 0.05,
    fontSize: 14,
    justifyContent: 'flex-end',
    color: '#BFC0BD',
    flexShrink: 1,
    fontWeight: 'bold',
  },
  bikeTextBottom: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: '2%',
    // borderWidth: 1,
  },
  bikeTextBottomPrice: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    // borderWidth: 1,
  },

  button: {
    flex: 1,
    // backgroundColor: '#B4FF39',
    // backgroundColor: 'black',
    color: '#000',
    justifyContent: 'center',
    top: '0%',
    // bottom: '10%',
    borderWidth: 1,
    borderColor: 'white',
    // marginBottom: '5%',
    // marginRight: '5%',
    borderRadius: 10,
    backgroundColor: '#18191a',
    // backgroundImage: require('../../../assets/swivel_login_background.jpg'),
  },
  buttonText: {
    fontWeight: 'bold',
    // color: '#300000',
    color: '#B4FF39',
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    opacity: 1,
    // backgroundColor: 'yellow',
  },

  buttonAddBike: {
    flex: 1,
    justifyContent: 'center',
    top: '0%',
    // borderWidth: 1,
    backgroundColor: '#B4FF39',
  },

  buttonAddBikeText: {
    fontWeight: 'bold',
    color: '#000',
    // color: '#B4FF39',
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    opacity: 1,
    // backgroundColor: 'green',
  },
});
export default GarageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000',
    // marginTop: 30,
  },
  textBoxContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: '150%',
    // width: '15%',
    // height: '15%',
  },
  modal: {
    flex: 1,
    width: '75%',
    // height: '25%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    backgroundColor: '#000',
    // paddingHorizontal: '20%',
    position: 'absolute',
    bottom: '25%',
    left: '12.5%',
    // right: '20%',
    borderRadius: 20,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  textBox: {
    // borderWidth: 1,
    flex: 1,
    // flexGrow: 1,
    paddingVertical: '10%',
    // paddingHorizontal: '37.5%',
    // marginHorizontal: 10,
    // // alignContent: 'center',
    // textAlign: 'center',
    // backgroundColor: 'white',
    fontSize: 20,
    // alignItems: 'stretch'
    borderWidth: 1,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
