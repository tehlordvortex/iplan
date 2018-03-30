// Initialize Firebase
import { firebase } from '@firebase/app'
import * as firebaseui from 'firebaseui'

export const CLIENT_ID = '518449597924-or8bthfuh06l92274s3fnmgem8l6sreb.apps.googleusercontent.com'
export const fbConfig = {
  apiKey: 'AIzaSyAG8LJTZlmqw0WtZ3_bv7zrQdsDngSfrVE',
  authDomain: 'iplan-4fb5b.firebaseapp.com',
  databaseURL: 'https://iplan-4fb5b.firebaseio.com',
  projectId: 'iplan-4fb5b',
  storageBucket: 'iplan-4fb5b.appspot.com',
  messagingSenderId: '518449597924'
}

export const fbUIConfig = {
  signInSuccessUrl: '#/todos',
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return true
    }
  },
  signInFlow: 'redirect',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
      // authMethod: 'https://accounts.google.com',
      // clientId: CLIENT_ID
    },
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '#/tos',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
}
