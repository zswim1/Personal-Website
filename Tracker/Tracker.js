var state = {
    totalMiles: 0,
    intervalsDone: 0,
    doneTracking: false,
    startTime: false,
    initialLocation: true,
    distanceUnit: "Miles",
    distanceInterval: 1.0,
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    time: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    lastSplitTime: "0.0.0",
}




/* stops tracking of distance and time */
function finish(){
    state.doneTracking = true;
    state.startTime = false;
    // document.getElementById("splitContent").innerHTML = document.getElementById("intervalTimes").innerHTML;
    document.getElementById("distanceHolder").innerHTML = document.getElementById("distance").innerHTML;
    document.getElementById("timeHolder").innerHTML = document.getElementById("time").innerHTML;
    var pace = calculatePace(document.getElementById("distance").innerHTML, document.getElementById("time").innerHTML);
    updateView("end");
    playSound('workout finished');
}

function reset(){
    state.lastLocation = {
        latitude: 0,
        longitude: 0
    };
    state.time = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    state.totalMiles = 0;
    state.doneTracking = false;
    updateView("reset");
}




/* gets location permission, starts distance and time tracking */
function track(){
    console.log("starting to track");
    var id,options;

    state.message = new SpeechSynthesisUtterance();
    state.voices = speechSynthesis.getVoices();


    function success(pos) {
        state.startTime = true;
        console.log("updating position")
        var coord = pos.coords;
        var lat = coord.latitude;
        var long = coord.longitude;
        if(state.initialLocation){
            playSound('Begin workout');
            timeTrack();
            updateView("during");
            // initMap();

            state.lastLocation = {
                latitude: coord.latitude, 
                longitude: coord.longitude
            };
            state.initialLocation = false;
        } else {
            var dist = calcDistance(state.lastLocation, coord, state.distanceUnit);
            state.totalMiles += dist;
            state.lastLocation = {
                latitude: coord.latitude, 
                longitude: coord.longitude
            };
        }

        if(state.doneTracking){
            navigator.geolocation.clearWatch(id);
            console.log("finished tracking");
        }
    }

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000
    };

    id = navigator.geolocation.watchPosition(success, error, options);
}





/* adds a second to the time every second, logs at assigned interval distance */
function timeTrack(){
    var hours = state.time.hours;
    var minutes = state.time.minutes;
    var seconds = state.time.seconds;
    var timeString = "";
    var refreshId = setInterval(function(){
        if(state.startTime && !state.doneTracking){
            seconds++;
            if(seconds >= 60){
                seconds = 0;
                minutes++;
                if(minutes >=60){
                    minutes = 0;
                    hours++;
                }
            }
            timeString = stringReformat(hours + "." + minutes + "." + seconds);
            
            distanceString = state.totalMiles.toFixed(2);
            if(state.distanceUnit == "Miles"){
                distanceString += " Miles";
            } else {
                distanceString += " KM";
            }
            document.getElementById("time").innerHTML = timeString;
            document.getElementById("distance").innerHTML = distanceString;

            var nextInterval = (1+state.intervalsDone) * state.distanceInterval;
            if(state.totalMiles >= nextInterval){
                if(state.intervalsDone == 0){
                    document.getElementById("intervalTimes").classList.remove("hidden");
                }
                state.intervalsDone ++;

                var unitStr = "";
                if(state.distanceUnit == "Miles"){
                    unitStr = " Miles";
                    if(nextInterval == 1){
                        unitStr = " Mile";
                    }
                } else {
                    unitStr = " KM";
                }
                var splitString = hours + "." + minutes + "." + seconds;
                var splitTime = getSplitTime(splitString, state.lastSplitTime);
                var intervalString = "<div class='intervalPair'><div>" + nextInterval + unitStr + "</div><div> Split: " + splitTime + " </div></div>"
                document.getElementById("intervalTimes").innerHTML += intervalString;
                var str = state.distanceUnit;
                if(nextInterval == 1){
                    str = str.substring(0, str.length - 1);
                }
                var speakString = "Distance: " + nextInterval + " " + str + ", Split Time: " + splitTime + ", Total time: " + timeString;
                playSound(speakString);
            }
        } else if(state.doneTracking){
            state.time = {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
            clearInterval(refreshId);
        }
    }, 1000);
}





/* calculates distance between 2 given lat/long coordinates in unit selected */
function calcDistance(crd1, crd2, unit){
    var lat1 = crd1.latitude;
    var long1 = crd1.longitude;
    var lat2 = crd2.latitude;
    var long2 = crd2.longitude;

    if ((lat1 == lat2) && (long1 == long2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = long1-long2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="Kilometers") { dist = dist * 1.609344 }
		return dist;
	}
}

function updateDistanceUnit(unit){
    state.distanceUnit = unit;
}

function updateDistanceInterval(interval){
    state.distanceInterval = interval;
}

function updateView(state){
    if(state == "during"){
        document.getElementById("beforeStart").classList.add("hidden");
        document.getElementById("duringExercise").classList.remove("hidden");
    } else if(state == "end"){
        document.getElementById("duringExercise").classList.add("hidden");
        document.getElementById("afterFinish").classList.remove("hidden");
    } else if(state == "reset"){
        document.getElementById("beforeStart").classList.remove("hidden");
        document.getElementById("afterFinish").classList.add("hidden");
    }
}

function getSplitTime(newT, oldT){
    var oldSplit = oldT.split(".");
    var newSplit = newT.split(".");
    // console.log(oldSplit, newSplit, state.lastSplitTime);
    state.lastSplitTime = newSplit[0] + "." + newSplit[1] + "." + newSplit[2];
    var hourDiff = parseInt(newSplit[0]) - parseInt(oldSplit[0]);
    var minuteDiff = parseInt(newSplit[1]) - parseInt(oldSplit[1]);
    var secondDiff = parseInt(newSplit[2]) - parseInt(oldSplit[2]);
    var returnString =  stringReformat(hourDiff + "." + minuteDiff + "." + secondDiff);
    return returnString;
}

function stringReformat(timeString){
    var str = timeString.split(".");
    var hours = parseInt(str[0]);
    var minutes = parseInt(str[1]);
    var seconds = parseInt(str[2]);
    if(seconds == 1){
        timeString = seconds + " second";
    }else {
        timeString = seconds + " seconds";
    }
    if(minutes > 0){
        if(minutes > 1){
            timeString = minutes + " minutes, " + timeString;
        } else {
            timeString = minutes + " minute, " + timeString;
        }
        if(hours > 0){
            if(hours > 1){
                timeString = hours + " hours, " + timeString;
            } else {
                timeString = hours + " hour, " + timeString;
            }
        }
    }
    return timeString;
}

function playSound(messageToPlay){
    var msg = state.message;
    msg.voice = state.voices[0]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 0.8; // 0.1 to 10
    msg.pitch = 1; //0 to 2
    msg.lang = 'en-US';

    msg.text = messageToPlay;

    // msg.onend = function(e) {
    //     console.log('Finished in ' + event.elapsedTime + ' seconds.');
    //   };
    // console.log(state.voices);

    speechSynthesis.speak(msg);
}

function addAnInterval(){
    state.totalMiles += state.distanceInterval;
}


function calculatePace(distance, time){
    var distNum = parseInt(distance.split(" ")[0]);
    var timeParts = time.split(",");
    var hours = 0, minutes =0, seconds= 0;
    if(timeParts.length == 3){
        hours = parseInt(timeParts[0].split(" ")[0]);
        minutes = parseInt(timeParts[1].split(" ")[1]);
        seconds = parseInt(timeParts[2].split(" ")[1]);
    } else if(timeParts.length == 2){
        minutes = parseInt(timeParts[0].split(" ")[0]);
        seconds = parseInt(timeParts[1].split(" ")[1]);
    } else {
        seconds = parseInt(timeParts[0].split(" ")[0]);
    }
    console.log(minutes, seconds, distNum);
    var totalSeconds = hours*3600 + minutes*60 + seconds;
    var pace = Math.round(totalSeconds / distNum);
    var paceMinutes = Math.round(pace / 60);
    var paceSeconds = pace % 60;
    // console.log(paceMinutes, paceSeconds);

    // console.log(distance, time);
}

function unitSelect(id){
    if(id == 0){
        document.getElementById("mileButton").classList.add("selected");
        document.getElementById("mileButton").onclick = null;
        document.getElementById("kmButton").classList.remove("selected");
        document.getElementById("kmButton").onclick = function() {unitSelect(1)};
        updateDistanceUnit("Miles")
    } else {
        document.getElementById("kmButton").classList.add("selected");
        document.getElementById("kmButton").onclick = null;
        document.getElementById("mileButton").classList.remove("selected");
        document.getElementById("mileButton").onclick = function() {unitSelect(0)};
        updateDistanceUnit("Kilometers")
    }
}

function intSelect(id){
    if(id == 0){
        document.getElementById("intervalButton0").classList.add("selected");
        document.getElementById("intervalButton0").onclick = null;
        document.getElementById("intervalButton1").classList.remove("selected");
        document.getElementById("intervalButton1").onclick = function() {intSelect(1)};
        document.getElementById("intervalButton2").classList.remove("selected");
        document.getElementById("intervalButton2").onclick = function() {intSelect(2)};
        document.getElementById("intervalButton3").classList.remove("selected");
        document.getElementById("intervalButton3").onclick = function() {intSelect(3)};
        updateDistanceInterval(1.0);
    } else if(id == 1){
        document.getElementById("intervalButton1").classList.add("selected");
        document.getElementById("intervalButton1").onclick = null;
        document.getElementById("intervalButton0").classList.remove("selected");
        document.getElementById("intervalButton0").onclick = function() {intSelect(0)};
        document.getElementById("intervalButton2").classList.remove("selected");
        document.getElementById("intervalButton2").onclick = function() {intSelect(2)};
        document.getElementById("intervalButton3").classList.remove("selected");
        document.getElementById("intervalButton3").onclick = function() {intSelect(3)};
        updateDistanceInterval(0.5);
    }else if(id == 2){
        document.getElementById("intervalButton2").classList.add("selected");
        document.getElementById("intervalButton2").onclick = null;
        document.getElementById("intervalButton1").classList.remove("selected");
        document.getElementById("intervalButton1").onclick = function() {intSelect(1)};
        document.getElementById("intervalButton0").classList.remove("selected");
        document.getElementById("intervalButton0").onclick = function() {intSelect(0)};
        document.getElementById("intervalButton3").classList.remove("selected");
        document.getElementById("intervalButton3").onclick = function() {intSelect(3)};
        updateDistanceInterval(0.25);
    } else {
        document.getElementById("intervalButton3").classList.add("selected");
        document.getElementById("intervalButton3").onclick = null;
        document.getElementById("intervalButton1").classList.remove("selected");
        document.getElementById("intervalButton1").onclick = function() {intSelect(1)};
        document.getElementById("intervalButton2").classList.remove("selected");
        document.getElementById("intervalButton2").onclick = function() {intSelect(2)};
        document.getElementById("intervalButton0").classList.remove("selected");
        document.getElementById("intervalButton0").onclick = function() {intSelect(0)};
        updateDistanceInterval(0.1);
    }
}