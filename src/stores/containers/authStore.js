/* eslint-disable react-hooks/rules-of-hooks */
import { action, flow, computed, makeObservable, observable } from 'mobx';
import { getEnv } from 'mobx-easy';
import { reportsAPI } from '../../services/baseAPI';

import useLocalStorage from '../../hooks/useLocalStorage';

import User from '../models/User';

export default class AuthStore {
  user = null;

  authStatus = 'unauthenticated';

  autoLogin = false;

  fetchDataLog = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      authStatus: observable,
      autoLogin: observable,
      fetchDataLog: observable,

      isAuthenticated: computed,
      isConfirmingIdentity: computed,
      isUnauthenticated: computed,

      setUser: action.bound,
      confirmIdentity: action.bound,
      unauthenticate: action.bound,
      setAutoLogin: action.bound,
      feedFetchDataLog: action.bound,
      setStatusConfirmingIdentity: action.bound,
      clearDataLog: action.bound,

      authenticate: flow,
    });
  }

  get isAuthenticated() {
    return this.authStatus === 'authenticated';
  }

  get isConfirmingIdentity() {
    return this.authStatus === 'confirming-identity';
  }

  get isUnauthenticated() {
    return this.authStatus === 'unauthenticated';
  }

  setUser(user) {
    this.user = User.fromApi(user);
  }

  confirmIdentity() {
    this.authStatus = 'authenticated';
  }

  setAutoLogin(payload) {
    this.autoLogin = payload;
  }

  feedFetchDataLog(text, status) {
    let color = '';
    switch (status) {
      case 'success': {
        color = '#27ae60';
        break;
      }

      case 'error': {
        color = '#c0392b';
        break;
      }

      default: {
        color = '#ffffff';
        break;
      }
    }
    if (typeof text === 'string' && text.length) {
      this.fetchDataLog.push({ text, color });
    }
  }

  clearDataLog() {
    this.fetchDataLog = [];
  }

  setStatusConfirmingIdentity() {
    this.authStatus = 'confirming-identity';
  }

  unauthenticate() {
    this.authStatus = 'unauthenticated';
    this.user = null;
    getEnv().defaults.headers.common['X-Api-Key'] = null;
  }

  *authenticate(apiKey) {
    try {
      const [, setApiKey] = useLocalStorage('clockify-api-key');
      getEnv().defaults.headers.common['X-Api-Key'] = apiKey;
      reportsAPI.defaults.headers.common['X-Api-Key'] = apiKey;
      setApiKey(apiKey);

      const response = yield getEnv().get(`/user`);

      if (response?.status !== 200) {
        alert('Invalid Clockify API Key');
        return false;
      }

      if (response?.data) {
        this.setUser(response.data);
        this.authStatus = 'confirming-identity';
        return true;
      }

      this.unauthenticate();
      return false;
    } catch (error) {
      console.log(error);
      this.unauthenticate();
      alert('Invalid Clockify API Key');
      return false;
    }
  }
}
