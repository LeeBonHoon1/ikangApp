import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DismissKeyboardView from '../components/DissmissKeyboardView';
import {RootStackParamList} from '../../AppInner';
import APIs from '../lib/APIs';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation, route}: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const phoneRef = useRef<TextInput | null>(null);
  const nickNameRef = useRef<TextInput | null>(null);

  const user = route.params.user;

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangeName = useCallback((text: string) => {
    setName(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onChangePhone = useCallback((text: string) => {
    setPhone(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (!phone || !phone.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    const params = {
      email: email,
      name: name,
      number: phone,
      password: password,
      sortation: user === 'teacher' ? 1 : 2,
    };

    setLoading(true);

    APIs.signupRequest(params)
      .then(res => {
        if (res) {
          setLoading(false);
          Alert.alert('알림', '회원가입 되었습니다.');
          navigation.navigate('SignIn');
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        Alert.alert('알림', '잠시후에 다시 시도해주세요');
      });
  }, [loading, navigation, email, name, password, phone, user]);

  const canGoNext = email && name && password && phone;
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일을 입력해주세요"
          placeholderTextColor="#666"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이름을 입력해주세요."
          placeholderTextColor="#666"
          onChangeText={onChangeName}
          value={name}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
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
          onChangeText={onChangePassword}
          value={password}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={() => phoneRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>휴대전화번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor="#666"
          onChangeText={onChangePhone}
          value={phone}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="name"
          secureTextEntry
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={phoneRef}
          onSubmitEditing={() => nickNameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.buttonZone}>
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
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
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
    backgroundColor: '#f4a555',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  toggle: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default SignUp;
