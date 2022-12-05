'use strict';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

export function generateHeader() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = useNavigation();
  const header = [];

  header.push(
    <View style={headerFooterStyles.default} key={0}>
      <TouchableOpacity
        style={headerFooterStyles.headerButtonSwivel}
        onPress={() => navigation.navigate('Map')}
      >
        <Image
          style={headerFooterStyles.headerImageSwivel}
          source={require('../../../assets/swivel_logo.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={headerFooterStyles.headerButtonUser}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          style={headerFooterStyles.headerImageUser}
          source={require('../../../assets/user_icon.jpg')}
        />
      </TouchableOpacity>
    </View>
  );
  return header;
}

export function generateFooter() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = useNavigation();
  const footer = [];
  const route = useRoute();

  let bikeImage;
  let garageImage;
  if (route.name == 'CurrentBike') {
    bikeImage = require('../../../assets/footer_bike_highlighted.png');
  } else {
    bikeImage = require('../../../assets/footer_bike.png');
  }

  if (route.name == 'Garage') {
    garageImage = require('../../../assets/footer_garage_highlighted.png');
  } else {
    garageImage = require('../../../assets/footer_garage.png');
  }

  footer.push(
    <View style={headerFooterStyles.default} key={1}>
      <TouchableOpacity
        style={headerFooterStyles.footerButtonBike}
        onPress={() => navigation.navigate('CurrentBike')}
      >
        <Image style={{ resizeMode: 'contain', height: '60%', width: '50%' }} source={bikeImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={headerFooterStyles.footerButtonGarage}
        onPress={() => navigation.navigate('Garage')}
      >
        <Image
          style={{ resizeMode: 'contain', height: '60%', width: '50%' }}
          source={garageImage}
        />
      </TouchableOpacity>
    </View>
  );
  return footer;
}

export const headerFooterStyles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#5dc00',
    borderWidth: 1,
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: '#5dc00',
    // alignItems: 'center',
    borderWidth: 1,

  },
  headerButtonSwivel: {
    flex: 0.5,
    // backgroundColor: '#55252',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    marginLeft: '5%',
    marginTop: '8%',
    alignSelf: 'center',
  },
  headerButtonUser: {
    flex: 0.5,
    // backgroundColor: '#55252',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // marginTop: '9%',
    // alignSelf: 'center',
  },
  headerImageSwivel: {
    resizeMode: 'contain',
    height: '60%',
    width: '75%',
  },
  headerImageUser: {
    resizeMode: 'contain',
    height: '60%',
    width: '60%',
  },

  body: {
    flex: 0.8,
    // backgroundColor: '#fff',
  },
  footer: {
    flex: 0.1,
    flexDirection: 'row',
    // backgroundColor: '#5dc00',
    borderWidth: 1,
  },
  footerButtonBike: {
    flex: 0.5,
    // backgroundColor: '#55252',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '20%',
  },
  footerButtonGarage: {
    flex: 0.5,
    // backgroundColor: '#55252',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20%',
  },
});
