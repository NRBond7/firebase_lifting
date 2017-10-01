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