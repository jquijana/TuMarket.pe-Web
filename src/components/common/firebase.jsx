import app from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import { firebaseConfig } from '../../utils/Constants';

/*const firebase = app.initializeApp(firebaseConfig);
const storage = firebase.storage();
const auth = firebase.auth();
//const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export {auth, storage, firebase };
*/

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.storage = app.storage();

    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    logout() {
        return this.auth.signOut()
    }

    async register(name, email, password) {
        const response = await this.auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.auth.currentUser.updateProfile({ displayName: name })
                return {
                    code: "successful",
                    data: user
                }
            })
            .catch(function (error) {
                return {
                    code: error.code,
                    data: error.message
                }
            });
        return response;
    }

    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }

    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName
    }

}

export default new Firebase()