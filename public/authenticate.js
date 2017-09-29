function authenticate() {
  var user = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var signedInUser = result.user;

        firebase.database().ref("/users").push({
          name : signedInUser.displayName,
          email : signedInUser.email,
          id : signedInUser.uid
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  });
}