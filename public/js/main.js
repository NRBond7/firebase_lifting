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
    emptyDropdown(dropdown);

    snap.forEach(childSnapshot => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var dropdownOption = document.createElement('option');

      dropdownOption.value = childKey;
      dropdownOption.textContent = childSnapshot.child("name").val();
      dropdown.add(dropdownOption, 0);
    })

    dropdown.selectedIndex = 0;
    populateDayDropdown();
  });
}

function onUserSelected() {
   populateDayDropdown();
}

function populateDayDropdown() {
  var username = document.getElementById('select_user').value;
  var liftLog = firebase.database().ref("/lift_log/" + username);
  var dropdown = document.getElementById('select_day');

  liftLog.on('value', snap => {
    emptyDropdown(dropdown);

    var lastLift;
    if (snap.numChildren() > 0) {
      snap.forEach(childSnapshot => {
        var dropdownOption = document.createElement('option');
        var childKey = childSnapshot.key;
        var liftDate = childSnapshot.child("date").val();
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
    loadDataForDay(nextLift);
  });
}

function onDaySelected() {
  var liftType = document.getElementById('select_day').value;
  var liftName;

  switch (liftType) {
    case "deadlift":
     liftName = "OHP";
     break;
    case "overhead_press":
      liftName = "Back Squat";
      break;
    case "back_squat":
      liftName = "Bench Press";
      break;
    case "bench_press":
     liftName = "Deadlift";
      break;
    default:
      liftName = "Deadlift";
      break;
  }

  loadDataForDay({liftType : liftType, liftName : liftName})
}

function loadDataForDay(nextLift) {
  const title = document.getElementById('lift_day_header');

  title.textContent = nextLift.liftName + " Day";

  localStorage.setItem("liftData", JSON.stringify(nextLift));

  populateLiftUI(nextLift);
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

function emptyDropdown(dropdown) {
  dropdown.options.length = 0;
}

function skipWorkout() {
  uploadWorkout(true);
}

function finishWorkout() {
  if (document.getElementById('lift_pr_field').value) {
    uploadWorkout(false);
  } else {
    showSnackBar("Enter a PR for today's main lift");
  }
}

function uploadWorkout(wasSkipped) {
  var dateFormat = require('dateformat');
  var liftData = JSON.parse(localStorage.getItem("liftData"));
  var username = document.getElementById('select_user').value;
  var workoutData = {
    date : dateFormat(new Date(), "mm/dd/yyyy"),
    lift_type : liftData.liftType,
    lift_name : liftData.liftName,
    lift_pr : document.getElementById('lift_pr_field').value,
    was_skipped : wasSkipped
  };

  firebase.database().ref('lift_log/' + username).push(workoutData, onUploadCompleted);
}

function onUploadCompleted() {
  document.getElementById('lift_pr_field').value = document.getElementById('lift_pr_field').textContent = "";
  showSnackBar("Workout uploaded");
}

function showSnackBar(message) {
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar({message: message});
}