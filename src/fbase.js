import { firebase } from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'
import { fbConfig } from '@/config'

export const firebaseApp = firebase.initializeApp(fbConfig)
export const firestore = firebaseApp.firestore()
