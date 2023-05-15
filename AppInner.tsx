import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Notice from './src/pages/Notice';
import Search from './src/pages/Search';
import Main from './src/pages/Main';
import SignupEmail from './src/pages/SignUpEmail';
import SignUpPassword from './src/pages/SignUpPassword';
import SignUpPhone from './src/pages/SignUpPhone';
import SignUpName from './src/pages/SignUpName';
import NoticeDetail from './src/pages/NoticeDetail';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import React, {useCallback, useEffect} from 'react';
import {Platform, Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {useAppDispatch} from './src/store';
import firebaseSlice from './src/slices/firebase';
// import axios from 'axios';
import APIs from './src/lib/APIs';

// import {useAppDispatch} from './src/store';
// import firebaseSlice from './src/slices/firebase';
// import {Alert} from 'react-native';
// import EncryptedStorage from 'react-native-encrypted-storage';

export type RootStackParamList<T = Array<string | number>> = {
  SignIn: undefined;
  SignUp: Partial<{
    user: string;
  }>;
  SignUpEmail: Partial<{
    sortation?: string;
  }>;
  SignUpPassword: Partial<{
    sortation?: number;
    email?: string;
  }>;
  SignUpPhone: Partial<{
    sortation?: number;
    email?: string;
    password?: string;
  }>;
  SignUpName: Partial<{
    sortation?: number;
    email?: string;
    password?: string;
    number?: string;
  }>;
  Main: undefined;
  Notice: undefined;
  Search: undefined;

  AddNotice: undefined;
  NoticeDetail: {
    data: T[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const checkPermissionANDROID = async () => {
    const firebaseToken = await getFcmToken();
    await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(res => {
      if (res === 'granted') {
        dispatch(
          firebaseSlice.actions.setFirebaseToken({
            token: firebaseToken,
          }),
        );
      }
      if (res === 'denied') {
        request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(res => {
          if (res === 'granted') {
            Alert.alert('푸쉬알림 수신이 동의 되었습니다.');
            dispatch(
              firebaseSlice.actions.setFirebaseToken({
                token: firebaseToken,
              }),
            );
          }
          if (res === 'denied') {
            Alert.alert('앱 설정에서 수신 상태를 재설정 할 수 있습니다.');
          }
        });
      }
    });
  };

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    dispatch(
      firebaseSlice.actions.setFirebaseToken({
        token: fcmToken,
      }),
    );
    // const param = {
    //   token: fcmToken,
    // };
    // await APIs.sendToken(param);
    return fcmToken;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android' && DeviceInfo.getApiLevelSync() >= 33)
      checkPermissionANDROID();
  }, []);

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage));
    });
  }, []);

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notice"
        component={Notice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpEmail"
        component={SignupEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpPassword"
        component={SignUpPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpPhone"
        component={SignUpPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpName"
        component={SignUpName}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
