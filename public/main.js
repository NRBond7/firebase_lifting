function initFirebase() {
    var config = {
      apiKey: "AIzaSyCaSPFEJM5NHYXJ-jSFOYh9TBsZhzOeOG4",
      authDomain: "lifting-test-1.firebaseapp.com",
      databaseURL: "https://lifting-test-1.firebaseio.com",
      projectId: "lifting-test-1",
      storageBucket: "lifting-test-1.appspot.com",
      messagingSenderId: "669558100073"
    };
    firebase.initializeApp(config);
}

function testFirebase() {
	const preObject = document.getElementById('test')
    const noah = firebase.database().ref("intensities");

    noah.once('value').then(snap => {
      preObject.innerText = JSON.stringify(snap.val(), null, 3);
    });
}