import React from 'react';
import {View, Text, StyleSheet, Alert, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../slices/user';

type MainInScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

const Main = ({navigation}: MainInScreenProps) => {
  const isIos = Platform.OS === 'ios';
  const dispatch = useAppDispatch();

  const goNotice = () => {
    navigation.navigate('Notice');
  };
  const logout = () => {
    EncryptedStorage.removeItem('accessToken');
    dispatch(
      userSlice.actions.setUser({
        name: '',
        email: '',
        number: '',
        password: '',
        sortation: 0,
        userIdx: 0,
        token: '',
        isLoggedIn: false,
      }),
    );
  };
  return (
    <View style={styles.container}>
      <Text style={isIos ? styles.iosLogout : styles.logout}>
        <Icon
          name="log-out-outline"
          size={40}
          color="#3f3d56"
          onPress={() =>
            Alert.alert(
              '알림',
              '로그아웃 하시겠습니까?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed!'),
                },
                {text: 'OK', onPress: logout},
              ],
              {cancelable: false},
            )
          }
        />
      </Text>
      <View style={styles.contents}>
        <View style={styles.icon}>
          <Text>
            <Icon
              name="megaphone-outline"
              size={70}
              color="#f4a555"
              onPress={goNotice}
            />
          </Text>
          <Text>공지사항</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contents: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 40,
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  iosLogout: {
    position: 'absolute',
    top: 45,
    right: 15,
  },
});

export default Main;
