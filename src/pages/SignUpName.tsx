import React, {useState, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../AppInner';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import APIs from '../lib/APIs';

type MainInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpName'
>;

const SignUpName = ({navigation, route}: MainInScreenProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const pushToken = useSelector((state: RootState) => state.firebase.token);
  const setChangeName = useCallback((text: string) => {
    setName(text.trim());
  }, []);

  const onSubmit = () => {
    setLoading(true);
    const param = {
      sortation: route.params.sortation,
      email: route.params.email,
      number: route.params.number,
      password: route.params.password,
      name: name,
      pushToken: pushToken,
    };

    console.log(param);
    APIs.signupRequest(param)
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
          Alert.alert('알림', '관리자 승인 후 로그인해주세요.');
          navigation.navigate('SignIn');
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('알림', '잠시 후 다시 시도해주세요.');
        console.log(err);
      });
  };

  const canGoNext = name;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/signup.png')}
        style={styles.logo}
      />
      <Text style={styles.mainTitle}>이강학원에 오신 걸 환영합니다!</Text>
      <Text style={styles.title}>이름을 입력해주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        onChangeText={setChangeName}
        value={name}
      />
      <Pressable
        style={
          canGoNext
            ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
            : styles.loginButton
        }
        disabled={!canGoNext || loading}
        onPress={onSubmit}>
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

export default SignUpName;
