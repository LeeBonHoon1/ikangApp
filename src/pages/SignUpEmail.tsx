import React, {useState, useEffect, useCallback} from 'react';
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
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DissmissKeyboardView';

type MainInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpEmail'
>;

const SIgnupEmail = ({navigation, route}: MainInScreenProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(route.params);
  }, [route]);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);

  const sendCheckEmail = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    navigation.navigate('SignUpPassword', {
      sortation: 2,
      email: email,
    });
    // const param = {
    //   email: email,
    // };

    // APIs.checkEmail(param)
    //   .then(res => {
    //     if (!res) {
    //       navigation.navigate('SignUpPassword', {
    //         sortation: 2,
    //         email: email,
    //       });
    //     } else {
    //       Alert.alert('알림', '이미 가입한 이메일입니다.');
    //     }
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     Alert.alert('알림', '잠시후에 다시 시도해주세요');
    //     setLoading(false);
    //   });
  };

  const canGoNext =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
      email,
    );
  return (
    <DismissKeyboardView
      contentContainerStyle={{
        flex: 1,
      }}
      style={{
        backgroundColor: 'white',
      }}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../img/signup.png')}
          style={styles.logo}
        />
        <Text style={styles.mainTitle}>이강학원에 오신 걸 환영합니다!</Text>
        <Text style={styles.title}>이메일을 입력해주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          onChangeText={onChangeEmail}
        />
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext || loading}
          onPress={sendCheckEmail}>
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
    </DismissKeyboardView>
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

export default SIgnupEmail;
