function populateLiftUI(nextLift) {
	var database = firebase.database();
	var user = {username : document.getElementById('select_user').value, name : document.getElementById('select_user').textContent};
	var index = document.getElementById('select_day').selectedIndex;
	var workoutNumber = document.getElementById('select_day').options.length - index;
	var weekNumber = Math.ceil(workoutNumber / 4);
	var wave = Math.floor((weekNumber - 1) / 3 + 1);

	var weekId;
	switch(weekNumber) {
		case 1:
		case 4:
		case 7:
			weekId = "147";
			break;
		case 2:
		case 5:
		case 8:
			weekId = "258";
			break;
		case 3:
		case 6:
		case 9:
			weekId = "369";
			break;
		default:
			weekId = "147";
			break;
	}

	console.log("workout - " + workoutNumber);
	console.log("week - " + weekNumber);
	console.log("wave - " + wave);

	localStorage.removeItem("workoutPattern");
	localStorage.removeItem("waveData");
	localStorage.removeItem("maxData");
	localStorage.removeItem("liftBlockData");
	localStorage.removeItem("liftBlockTypes");

	const workoutPattern = database.ref("pattern").child(weekId).child(nextLift.liftType);
	workoutPattern.on('value', snap => {
		localStorage.setItem("workoutPattern", JSON.stringify(snap));
		generateWorkout();
	});

	const waveData = database.ref("waves").child(wave);
	waveData.on('value', snap => {
		localStorage.setItem("waveData", JSON.stringify(snap));
		generateWorkout();
	});

	const maxData = database.ref("one_rep_maxes").child(user.username);
	maxData.on('value', snap => {
		localStorage.setItem("maxData", JSON.stringify(snap));
		generateWorkout();
	});

	const liftBlockData = database.ref("lift_blocks").child(nextLift.liftType);
	liftBlockData.on('value', snap => {
		localStorage.setItem("liftBlockData", JSON.stringify(snap));
		generateWorkout();
	});

	const liftBlockTypes = database.ref("lift_block_types");
	liftBlockTypes.on('value', snap => {
		localStorage.setItem("liftBlockTypes", JSON.stringify(snap));
		generateWorkout();
	});
}

function generateWorkout() {
	var workoutPattern = JSON.parse(localStorage.getItem("workoutPattern"));
	var waveData = JSON.parse(localStorage.getItem("waveData"));
	var maxData = JSON.parse(localStorage.getItem("maxData"));
	var liftBlockData = JSON.parse(localStorage.getItem("liftBlockData"));
	var liftBlockTypes = JSON.parse(localStorage.getItem("liftBlockTypes"));

	if (workoutPattern && waveData && maxData && liftBlockData && liftBlockTypes) {
		for (var x = 0; x < Object.keys(liftBlockTypes).length; x++) {
			var currentBlockId = liftBlockTypes[x]["id"];
			var currentBlockName = liftBlockTypes[x]["name"];

			//todo: put # of sets into firebase
			for (var y = 0; y < 3; y++){
				var currentSet = y + 1;
				var container = document.getElementById(currentBlockId + "_set_" + currentSet);
				container.innerHTML = "";
				
				for (var z = 0; z < Object.keys(liftBlockData[currentBlockId]).length; z++) {
					var liftBlock = document.createElement('div');
					var intensity = workoutPattern[currentBlockId]["intensity"];
					var liftType = liftBlockData[currentBlockId][z]["lift_type"];
					var liftName = liftBlockData[currentBlockId][z]["lift_name"];
					var hasPr = liftBlockData[currentBlockId][z]["has_pr"];
					var reps = waveData[intensity]["set_" + currentSet + "_reps"];

					if (hasPr) {
						var liftMax = maxData[liftType];
						var weightPercentage = waveData[intensity]["set_" + currentSet + "_percentage"];
						var liftWeight = roundDownCalculation(liftMax * weightPercentage);
						liftBlock.textContent = liftWeight + " x " + reps + " " + liftName;
					} else {
						liftBlock.textContent = reps + " " + liftName;
					}

					container.appendChild(liftBlock);
				}
			}
		}
	}
}

function roundDownCalculation(value) {
	return 2.5 * Math.floor(value / 2.5);
}