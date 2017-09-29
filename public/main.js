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

function onDaySelected() {
  const dropdown = document.getElementById('select_day');
  alert(dropdown.options[dropdown.selectedIndex].text);
}

function initUI() {
  // Make call to get info
  var database = firebase.database();
  var user = firebase.auth().currentUser;

  populateUserDropdown();
}

function populateLiftUI() {
  // Show and Populate day dropdown
  var liftLog = database.ref("lift_log");
  var dropdown = document.getElementById('select_day');


  //Populate Workout UI
}

function populateUserDropdown() {
  var users = firebase.database().ref('/users');
  var dropdown = document.getElementById('select_user');
  
  users.on('value', snap => {
    snap.forEach(childSnapshot => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var dropdownOption = document.createElement('option');

      dropdownOption.value = childKey;
      dropdownOption.textContent = childSnapshot.child("name").val();
      dropdown.add(dropdownOption, 0);
    })

    if (firebase.auth().currentUser) {
      selectUserFromDropdown(firebase.auth().currentUser);
    }
  });
}

function selectUserFromDropdown(user) {
  var dropdown = document.getElementById('select_user');
  for (x = 0; x < dropdown.size; x++) {
    var currentOption = dropdown.options[x];
    if (user.displayName == currentOption.val) {
      dropdown.value = user.displayName;
      break;
    }
  }
}