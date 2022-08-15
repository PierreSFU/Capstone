import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-web';

export default function App() {
  return (
    // NAVIGATE BETWEEN PAGES
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

/* NAVIGATE BETWEEN PAGES */
const Stack = createNativeStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Map" component={MapPage} />
      <Stack.Screen name="Delegator" component={DelegatorPage} />
    </Stack.Navigator>
  );
}

/* INITIAL SIGN IN PAGE */
function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/temp2.jpg')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={styles.image} width="35%" source={require('./assets/swivel_logo.png')} />

          <StatusBar style="auto" />
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email."
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password."
              placeholderTextColor="#003f5c"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          <TouchableOpacity style={styles.login_button} onPress={() => navigation.navigate('Map')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={[styles.create_account, styles.white]}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={[styles.forgot_button, styles.white]}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={[styles.terms_service, styles.white]}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

// This will open the delegator if possible
const delegatorButtonPress = () => {
  alert('Delegator Unlocked ');
  // Enter code to unlock delegator
};

// Map Page which will track bike location
export function MapPage({ navigation }) {
  const [delegatorStatus = 'LOCKED', setStatus] = useState('LOCKED');
  return (
    <View style={styles.container}>
      <Text>Swivel Map</Text>
      <StatusBar style="auto" />

      <Text style={[styles.title, styles.setColor]}>Insert map tracking</Text>

      {/* This is the bike selection button */}
      <TouchableOpacity style={styles.bike_button} onPress={() => navigation.navigate('Delegator')}>
        <Text style={[styles.title, styles.setColorGreen]}>Select Bike</Text>
      </TouchableOpacity>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.back_button} onPress={() => navigation.goBack()}>
        <Text style={[styles.title, styles.setColorWhite]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

// Page to unlock delegator
export function DelegatorPage({ navigation }) {
  const [telemetry, setTelemetry] = React.useState(undefined);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetch('http://iot.swivel.bike/telemetry/1')
        .then((resp) => resp.json())
        .then((resp) => {
          console.log(resp);
          setTelemetry(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 2000);
    return () => {
      window.clearInterval(updateInterval);
    };
  }, []);

  const getFriendlyNetworkStatus = () => {
    if (!telemetry) {
      return 'Unknown';
    }
    const { grps } = telemetry;
    const { network_status } = grps;
    if (network_status === 0 || network_status === 2) {
      return 'Searching (Operator)';
    } else if (network_status === 1) {
      return 'Registered (Home)';
    } else if (network_status === 3) {
      return 'Registration Denied';
    } else if (network_status === 5) {
      return 'Registered (Roaming)';
    }
    return 'Unknown';
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.dataContainerRow}>
          <View>
            <Text style={styles.dataHeader}>Signal (RSSI)</Text>
            <Text style={styles.dataValue}>{telemetry ? telemetry.grps.rssi : '0'} dBm</Text>
          </View>
          <View>
            <Text style={styles.dataHeader}>Network</Text>
            <Text style={styles.dataValue}>{getFriendlyNetworkStatus()}</Text>
          </View>
        </View>
        <View style={styles.dataContainerRow}>
          <View>
            <Text style={styles.dataHeader}>Long</Text>
            <Text style={styles.dataValue}>{telemetry ? telemetry.gps.longitude : '0'}</Text>
          </View>
          <View>
            <Text style={styles.dataHeader}>Lat</Text>
            <Text style={styles.dataValue}>{telemetry ? telemetry.gps.latitude : '0'}</Text>
          </View>
          <View>
            <Text style={styles.dataHeader}>Alt</Text>
            <Text style={styles.dataValue}>{telemetry ? telemetry.gps.altitude : '0'}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.unlockButton}>
            <Text style={styles.unlockButtonText}>Unlock Bike</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
/* DEFAULT STYLES */
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    flexDirection: 'column',
  },

  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '100%',
    minHeight: '25%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
  },

  dataContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  dataHeader: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#474343',
    marginBottom: 5,
  },

  dataValue: {
    fontSize: 14,
    color: '#000000',
  },

  unlockButton: {
    backgroundColor: '#B4FF39',
    color: '#000',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 25,
    marginBottom: 20,
  },

  unlockButtonText: {
    fontWeight: 'bold',
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
