import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList<{NOTICE_IDX: number; TITLE: string; CONTENT: string}>,
  'NoticeDetail'
>;

const NoticeDetail = ({navigation, route}: SignInScreenProps) => {
  const [ios, setIos] = useState(false);
  const {params: {data = null} = {}} = route;

  const goBack = () => {
    navigation.navigate('Notice');
  };

  // const getDetailData = useCallback(async() => {
  //   const params = {
  //     num : data
  //   }
  //   await APIs.getNoticeDetail()
  // }, [])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setIos(true);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.img}
        source={require('../img/detail.png')}
        resizeMode="contain">
        <View style={ios ? styles.iosArrow : styles.arrow}>
          <Icon
            name="chevron-back-outline"
            size={40}
            color="#3f3d56"
            onPress={goBack}
          />
        </View>
      </ImageBackground>
      {data &&
        data.map((item, idx) => {
          return (
            <View key={idx} style={styles.detail}>
              <Text style={styles.title}>{item.TITLE}</Text>
              <Text style={styles.content}>{item.CONTENT}</Text>
            </View>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  detail: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 15,
  },
  img: {
    height: 300,
  },
  arrow: {
    position: 'absolute',
    top: 0,
  },
  iosArrow: {
    position: 'absolute',
    top: 10,
  },
});

export default NoticeDetail;
