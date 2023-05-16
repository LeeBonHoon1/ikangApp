import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DissmissKeyboardView';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import APIs from '../lib/APIs';

type MainInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
function SignIn({navigation}: MainInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }

    const params = {
      email: email,
      password: password,
    };
    setLoading(true);

    try {
      setLoading(true);
      const res = await APIs.signIn(params);
      if (!res.userInfo.ADMISSION) {
        Alert.alert('알림', '회원승인 후 로그인이 가능합니다');
        return;
      }

      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          email: res.userInfo.EMAIL,
          name: res.userInfo.NAME,
          number: res.userInfo.NUMBER,
          password: res.userInfo.PASSWORD,
          userIdx: res.userInfo.USER_IDX,
          sortation: res.userInfo.SORTATION,
          groupIdx: res.userInfo.GROUP_IDX,
          token: res.token,
          isLoggedIn: true,
        }),
      );
      await EncryptedStorage.setItem('accessToken', res.token);
    } catch (err) {
      console.log(err);
      Alert.alert('알림', '잠시후에 다시 시도해주세요');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [loading, email, password, dispatch]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUpEmail', {sortation: 'student'});
  }, [navigation]);

  const isIos = Platform.OS === 'ios';
  const canGoNext = email && password;
  return (
    <DismissKeyboardView style={isIos ? styles.iosView : styles.view}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../img/edu.png')}
          resizeMode="contain">
          <View style={styles.logo} />
          <Text style={styles.companyName}>이강학원</Text>
        </ImageBackground>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeEmail}
            placeholder="이메일을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.textInput}
            placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            onChangeText={onChangePassword}
            value={password}
            autoComplete="password"
            textContentType="password"
            secureTextEntry
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
        </View>
        <View style={styles.buttonZone}>
          <Pressable
            style={
              canGoNext
                ? StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
                : styles.loginButton
            }
            disabled={!canGoNext || loading}
            onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
  },
  iosView: {
    backgroundColor: 'white',
    marginTop: 50,
  },
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    height: 350,
    position: 'relative',
  },
  companyName: {
    color: '#f4a555',
    position: 'absolute',
    fontSize: 30,
    top: 110,
    right: 70,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flex: 2,
    width: '100%',
    padding: 10,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f4a555',
  },
  subTitle: {
    fontSize: 17,
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '95%',
    alignItems: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#f9a826',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  // image: {
  //   width: '50',
  // },
});

export default SignIn;
