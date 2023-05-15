import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import axios from 'axios';
import {host} from '../lib/APIs';
import moment from 'moment';

interface NOTICE_TYPE {
  CONTENT: string;
  GROUP_NAME: string;
  NAME: string;
  NOTICE_IDX: number;
  REG_DATE: string;
  TITLE: string;
}

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'Notice'>;

const Notice = ({navigation}: SignInScreenProps) => {
  const [notice, setNotice] = useState([]);
  const [ios, setIos] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state: RootState) => state.user);
  const {groupIdx} = userInfo;

  const getNoticeList = useCallback(async () => {
    if (Platform.OS === 'ios') {
      setIos(true);
    }

    const res = await axios.get(`${host}/notice/getNoticeList`, {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    });
    if (res) {
      const result = res.data.filter(item => {
        return String(groupIdx) === item.TARGET || '0' === item.TARGET;
      });
      setNotice(result);
      setLoading(true);
    } else {
      Alert.alert('잠시 후 다시 시도해주세요');
    }
  }, [groupIdx, userInfo.token]);

  useEffect(() => {
    getNoticeList();
  }, [getNoticeList]);

  const goBack = () => {
    navigation.navigate('Main');
  };

  return (
    <>
      {loading ? (
        <View style={ios ? styles.iosContainer : styles.container}>
          <StatusBar hidden={false} />
          <ScrollView>
            <ImageBackground
              source={require('../img/notice.png')}
              style={styles.logo}
              resizeMode="contain">
              <View style={styles.arrow}>
                <Icon
                  name="chevron-back-outline"
                  size={40}
                  color="#3f3d56"
                  onPress={goBack}
                />
              </View>
            </ImageBackground>
            <View style={styles.notice}>
              {notice?.length
                ? notice.map((item: NOTICE_TYPE, idx: number) => {
                    return (
                      <View style={styles.contents} key={idx}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={styles.titleWrapper}>
                            <Text style={styles.noticeTitle}>{item.TITLE}</Text>
                            <Text style={styles.noticeDate}>
                              {moment(item.REG_DATE).format('YYYY-MM-DD')}
                            </Text>
                          </View>
                          <Text style={styles.noticeWriter}>{item.NAME}</Text>
                        </View>
                        <View style={styles.desc}>
                          <Text>{item.CONTENT}</Text>
                        </View>
                      </View>
                    );
                  })
                : null}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: 'white',
    paddingTop: 10,
    position: 'relative',
  },
  iosContainer: {
    display: 'flex',
    backgroundColor: 'white',
    paddingTop: 50,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    top: 10,
    left: 5,
  },
  iosArrow: {
    position: 'absolute',
    top: 10,
  },
  addNotice: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logo: {
    justifyContent: 'center',
    height: 200,
  },
  notice: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    marginLeft: 15,
    fontWeight: 'bold',
  },
  contents: {
    width: '90%',

    marginTop: 10,
    marginBottom: 10,
    // borderRadius: 15,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  noticeDate: {
    fontSize: 12,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
    color: '#3f3d56',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeImage: {
    backgroundColor: '#f9a826',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  desc: {
    padding: 10,
    marginTop: 10,
  },
  noticeTitle: {
    fontSize: 20,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
    color: '#3f3d56',
  },
  noticeWriter: {
    fontSize: 20,
    marginTop: 15,
    marginRight: 20,
    fontWeight: 'bold',
    color: '#3f3d56',
  },
  noticeDesc: {
    marginLeft: 40,
    fontSize: 15,
    marginTop: 15,
    width: '75%',
    color: '#92a1b8',
  },
});

export default Notice;
