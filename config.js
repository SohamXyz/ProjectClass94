import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyASyOjOtJla-X-b3io2eLoaUc_bIRFSIIc",
    authDomain: "book-santa-app.firebaseapp.com",
    databaseURL: "https://book-santa-app.firebaseio.com",
    projectId: "book-santa-app",
    storageBucket: "book-santa-app.appspot.com",
    messagingSenderId: "69634746716",
    appId: "1:69634746716:web:6fbbfc110fb4475365f999",
    measurementId: "G-DLB7XC0JPL"
  };

/*
var firebaseConfig = {
    apiKey: "AIzaSyA5M_V6PGnQwfGDxTixs2gsfG7gX28t5s4",
    authDomain: "studentassignmentapp.firebaseapp.com",
    projectId: "studentassignmentapp",
    storageBucket: "studentassignmentapp.appspot.com",
    messagingSenderId: "682344238293",
    appId: "1:682344238293:web:986dd6095fa7cb5739e65c"
  };
  */
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
