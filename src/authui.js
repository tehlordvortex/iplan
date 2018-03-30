import * as firebaseui from 'firebaseui'
import { firebase } from '@firebase/app'
const ui = new firebaseui.auth.AuthUI(firebase.auth())
ui.disableAutoSignIn()
export default ui
