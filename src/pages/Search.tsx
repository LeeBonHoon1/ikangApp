import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  BackHandler,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import Icon from 'react-native-vector-icons/Ionicons';
import APIs from '../lib/APIs';

interface Content {
  email?: string;
  name?: string;
  number?: string;
  sortation?: number;
}
type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
const Search = ({navigation}: SignInScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [ios, setIos] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');
  const [items, setItems] = useState([
    {label: '전체', value: 'all'},
    {label: '이름', value: 'name'},
    {label: '연락처', value: 'number'},
    {label: '이메일', value: 'email'},
  ]);

  // useEffect(() => {
  //   if (open) {
  //     setData([]);
  //   }
  // }, [open]);

  const handlePressBack = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handlePressBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handlePressBack);
    };
  }, [handlePressBack]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setIos(true);
    }
  }, []);

  // useEffect(() => {
  //   if (value === 'all') {
  //     setSearchInput('');
  //   }
  // }, [value]);

  const searchInputHandler = useCallback((text: string) => {
    setSearchInput(text.trim());
  }, []);

  const onSearch = () => {
    setLoading(true);
    if (!searchInput || !searchInput.trim()) {
      setLoading(false);
      return Alert.alert('알림', '검색어를 입력해주세요.');
    }

    const params = {
      sortation: value,
      searchData: value === 'all' ? '' : searchInput,
    };

    APIs.getSearchUser(params)
      .then(res => {
        if (res) {
          setLoading(false);
          setSearchInput('');
          setData(res);
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        Alert.alert('알림', '잠시 후 다시 시도해주세요.');
      });
  };

  return (
    <View style={ios ? styles.iosContainer : styles.container}>
      <View>
        <Text style={styles.searchText}>이강학원 회원조회</Text>
      </View>
      <View>
        <View style={styles.searchBar}>
          <View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
              selectedItemLabelStyle={{
                color: '#f4a555',
              }}
              textStyle={{
                color: '#929090',
              }}
              zIndex={1000}
            />
            <View style={styles.searchWrapper}>
              <TextInput
                value={searchInput}
                onSubmitEditing={onSearch}
                placeholder="검색 조건을 설정해주세요."
                onChangeText={searchInputHandler}
                importantForAutofill="yes"
                secureTextEntry
                clearButtonMode="while-editing"
                style={ios ? styles.iosTextInput : styles.textInput}
              />
              {loading ? (
                <ActivityIndicator
                  color="#f4a555"
                  style={styles.loading}
                  size="large"
                />
              ) : (
                <Icon
                  name="search"
                  size={30}
                  style={ios ? styles.iosSearchIcon : styles.searchIcon}
                  color={'#f4a555'}
                  onPress={onSearch}
                />
              )}
            </View>
          </View>
        </View>
        <ScrollView>
          {data.length ? (
            data.map((item: Content, idx) => {
              return (
                <View style={styles.card} key={idx}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.info}>
                    <Text>{`이메일: ${item.email}`}</Text>
                    <Text>{`연락처: ${item.number}`}</Text>
                    <Text>{`회원: ${
                      item.sortation === 1 ? '강사' : '학생'
                    }`}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View>
              <Image
                source={require('../img/nodata.png')}
                resizeMode="contain"
                style={styles.img}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  iosContainer: {
    display: 'flex',
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 60,
  },
  searchText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#f4a555',
    padding: 10,
  },
  searchWrapper: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    zIndex: 2000,
    marginBottom: 30,
  },
  dropdown: {
    width: '40%',
    borderColor: '#929090',
    height: 50,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: 200,
    right: -80,
    top: 10,
  },
  iosTextInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: 200,
    right: -80,
    top: 22,
  },
  searchIcon: {
    position: 'absolute',
    right: -120,
    top: 15,
  },
  iosSearchIcon: {
    position: 'absolute',
    right: -120,
    top: 15,
  },
  img: {
    width: '100%',
    height: 500,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    height: 90,
    backgroundColor: '#F9F9F9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    margin: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Search;
