import {get, post} from './index';

export const host = 'https://port-0-egback-ngsnp25lbrrh2ph.gksl2.cloudtype.app';

const getNoticeList = () => {
  const url = `${host}/notice/getNoticeList`;
  return get({url});
};

const signupRequest = (body: object) => {
  const url = `${host}/users/signup`;
  return post({url, body});
};

const signIn = (body: object) => {
  const url = `${host}/users/login`;
  return post({url, body});
};

const checkEmail = (body: object) => {
  const url = `${host}/users/emailCheck`;
  return post({url, body});
};

const getSearchUser = (body: object) => {
  const url = `${host}/users/userSearch`;
  return post({url, body});
};

const getNoticeDetail = (body: object) => {
  const url = `${host}/notice/detailNotice`;
  return post({url, body});
};

const sendToken = (body: object) => {
  const url = `http://172.30.1.47:8080/notification`;
  return post({url, body});
};

const APIs = {
  getNoticeList,
  signupRequest,
  signIn,
  checkEmail,
  getSearchUser,
  host,
  getNoticeDetail,
  sendToken,
};

export default APIs;
