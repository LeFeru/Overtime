// Import FirebaseAuth and firebase.
import React from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';

// Configure Firebase.
const config = {
    apiKey: "AIzaSyBGlunlJPS3kgnmynY6xN_HYKBkuMexEtg",
    authDomain: "overtime-b4199.firebaseapp.com",
    databaseURL: "https://overtime-b4199.firebaseio.com",
    projectId: "overtime-b4199",
    storageBucket: "overtime-b4199.appspot.com",
    messagingSenderId: "465441173991"
};
firebase.initializeApp(config);

class SignInScreen extends React.Component {

    state = {
        signedIn: false // Local signed-in state.
    };

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display PhoneNumber as auth provider.
        signInOptions: [
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        ],
        // Sets the `signedIn` state property to `true` once signed in.
        callbacks: {
            signInSuccess: () => {
                this.setState({ signedIn: true });
                return false; // Avoid redirects after sign-in.
            }
        }
    };

    render() {
        if (!this.state.signedIn) {
            return (
                <div>
                    <h1>My App</h1>
                    <p>Please sign-in:</p>
                    <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            );
        }
        return (
            <div>
                <h1>My App</h1>
                <p>Welcome! You are now signed-in!</p>
            </div>
        );
    }
}

ReactDOM.render(
    <SignInScreen />,
    document.getElementById('authentication')
);
