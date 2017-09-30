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

function initUI() {
  populateUserDropdown();
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

    dropdown.value = dropdown.options[0].value;
  });
}

function onUserSelected() {
   populateDayDropdown();
}

function populateDayDropdown() {
  var dateFormat = require('dateformat');
  var user = firebase.auth().currentUser;
  var liftLog = firebase.database().ref("/lift_log/" + user.displayName);
  var dropdown = document.getElementById('select_day');

  liftLog.on('value', snap => {
    var lastLift;
    if (snap.numChildren() > 0) {
      snap.forEach(childSnapshot => {
        var dropdownOption = document.createElement('option');
        var childKey = childSnapshot.key;
        var liftDate = dateFormat(childKey, "mm/dd/yyyy");
        var liftType = childSnapshot.child("lift_type").val();
        var liftName = childSnapshot.child("lift_name").val();

        dropdownOption.value = liftType;
        dropdownOption.textContent = liftDate + " - " + liftName;
        dropdown.add(dropdownOption, 0);
        lastLift = liftType;
      });
    }

    var nextLift = generateNextLiftDay(lastLift);
    var currentOption = document.createElement('option');
    currentOption.value = nextLift.liftType;
    currentOption.textContent = "Today - " + nextLift.liftName;
    dropdown.add(currentOption, 0);
    dropdown.value = currentOption.value;
  });
}

function onDaySelected() {
  const dropdown = document.getElementById('select_day');
  alert(dropdown.options[dropdown.selectedIndex].text);
}

function generateNextLiftDay(lastLift) {
  //todo: use strings from lift table
  if (lastLift) {
    switch (lastLift) {
      case "deadlift":
        return {liftType : "overhead_press", liftName : "OHP"};
      case "overhead_press":
        return {liftType : "back_squat", liftName : "Back Squat"};
      case "back_squat":
        return {liftType : "bench_press", liftName : "Bench Press"};
      case "bench_press":
        return {liftType : "deadlift", liftName : "Deadlift"};
      default:
        return {liftType : "deadlift", liftName : "Deadlift"};
    }
  } else {
    return {liftType : "deadlift", liftName : "Deadlift"};
  }
}