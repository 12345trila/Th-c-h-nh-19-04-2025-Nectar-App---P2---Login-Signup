import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();

function SelectLocationScreen({ navigation }) {
  const [zone, setZone] = useState('');
  const [area, setArea] = useState('');

  const zones = ['Hoan Kiem', 'Dong Da', 'Cau Giay', 'Ba Dinh', 'Thanh Xuan', 'Hai Ba Trung', 'Tan Binh', 'Binh Thanh', 'District 1', 'District 7'];

  const areas = {
    'Hoan Kiem': ['Old Quarter', 'Hang Bac', 'Hang Dao'],
    'Dong Da': ['Kham Thien', 'Xa Dan', 'Nga Tu So'],
    'Cau Giay': ['Dich Vong', 'Nghia Tan', 'Quan Hoa'],
    'Ba Dinh': ['Kim Ma', 'Lieu Giai', 'Ngoc Ha'],
    'Thanh Xuan': ['Nhan Chinh', 'Ha Dinh', 'Khuong Trung'],
    'Hai Ba Trung': ['Bach Mai', 'Le Dai Hanh', 'Minh Khai'],
    'Tan Binh': ['Bau Cat', 'Hoang Hoa Tham', 'Truong Chinh'],
    'Binh Thanh': ['Phan Van Tri', 'Dien Bien Phu', 'Van Kiep'],
    'District 1': ['Ben Nghe', 'Ben Thanh', 'Nguyen Thai Binh'],
    'District 7': ['Tan Phong', 'Phu My Hung', 'Tan Quy']
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/location.png')}
        style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Select Your Location</Text>
      <Text style={styles.subtitle}>
        Switch on your location to stay in tune with what's happening in your area
      </Text>

      <Text style={styles.label}>Your Zone</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={zone}
          onValueChange={(value) => {
            setZone(value);
            setArea('');
          }}
        >
          <Picker.Item label="Select Zone" value="" />
          {zones.map((z) => (
            <Picker.Item key={z} label={z} value={z} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Your Area</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={area}
          enabled={zone !== ''}
          onValueChange={(value) => setArea(value)}
        >
          <Picker.Item label="Types of your area" value="" />
          {zone !== '' &&
            areas[zone].map((a) => <Picker.Item key={a} label={a} value={a} />)}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 30 }]}
        onPress={() => {
          if (zone && area) {
            navigation.navigate('Login');
          } else {
            alert('Please select both Zone and Area');
          }
        }}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      alert('Vui lòng điền vào tất cả các trường');
      return;
    }
    try {
      const user = { username, email, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      alert('Tài khoản được tạo thành công');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
       <Image
        source={require('./assets/icon.png')}
        style={{ width: 100, height: 50, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonValue);
      setTimeout(() => {
        setLoading(false);
        if (user && user.email === email && user.password === password) {
          navigation.navigate('Home');
        } else {
          alert('Email hoặc mật khẩu không hợp lệ');
        }
      }, 1000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       <Image
        source={require('./assets/icon.png')}
        style={{ width: 100, height: 50, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home!</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectLocation" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 10,
  },
});
