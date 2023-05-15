import React, {useState, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../AppInner';

type MainInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpPhone'
>;

const SignUpPhone = ({navigation, route}: MainInScreenProps) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeNumber = useCallback((text: string) => {
    setPhone(text.trim());
  }, []);

  const nextRoute = () => {
    setLoading(false);
    navigation.navigate('SignUpName', {
      sortation: route.params.sortation,
      email: route.params.email,
      password: route.params.password,
      number: phone,
    });
  };

  const canGoNext = phone;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/signup.png')}
        style={styles.logo}
      />
      <Text style={styles.mainTitle}>이강학원에 오신 걸 환영합니다!</Text>
      <Text style={styles.title}>휴대전화번호를 입력해주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="휴대전화번호"
        onChangeText={onChangeNumber}
        value={phone}
        keyboardType="number-pad"
      />
      <Pressable
        style={
          canGoNext
            ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
            : styles.loginButton
        }
        disabled={!canGoNext || loading}
        onPress={nextRoute}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={
              !canGoNext
                ? styles.loginButtonText
                : styles.confirmloginButtonText
            }>
            확인
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    display: 'flex',
    height: 200,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#f4a555',
  },
  title: {
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    height: 50,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingLeft: 12,
    width: '100%',
    borderRadius: 10,
  },
  loginButton: {
    height: 50,
    marginTop: 20,
    width: '100%',
    backgroundColor: '#bec0c4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#f4a555',
  },
  loginButtonText: {
    fontSize: 15,
    color: '#86898e',
  },
  confirmloginButtonText: {
    fontSize: 15,
    color: 'white',
  },
});

export default SignUpPhone;
