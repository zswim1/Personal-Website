import React, {useState, useEffect} from 'react';
// import ReactDOM from 'react-dom';
import './Exercise.css';
import Button from 'react-bootstrap/Button';
import useStateWithCallback from 'use-state-with-callback';
import ReactMapGL, {Marker} from 'react-map-gl';
// import 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css';


function Exercise(){
    /* used to set the current mode */
    const [screen, setScreen] = useState(0); /* 0:before, 1:during exercise, 2:after */

    /* for before exercise */
    const [unitButton1, setUButton1] = useState("primary");
    const [unitButton2, setUButton2] = useState("secondary");
    const [currentUnit, setCurrentUnit] = useState("Miles");
    const [displayUnit, setDisplayUnit] = useState("Mi");
    const [intervalButton1, setIButton1] = useState("primary");
    const [intervalButton2, setIButton2] = useState("secondary");
    const [intervalButton3, setIButton3] = useState("secondary");
    const [intervalButton4, setIButton4] = useState("secondary");
    const [currentInterval, setCurrentInterval] = useState(1);
    const [soundButton1, setSButton1] = useState("success");
    const [soundButton2, setSButton2] = useState("secondary");
    const [isSoundOn, setSound] = useState(true);
    const [trackTime, setTrackTime] = useState(false);
    const [once, setOnce] = useState(true);
    // const [finishTime, setFinishTime] = useState("");
    const [startTime, setStartTime] = useStateWithCallback("", startTime => {
        if(startTime !== "" && once){
            setOnce(false);
            if(isSoundOn){
                playSound('Begin workout');
            }
            setTrackTime(true);
        }
    });
    const [message, setMessage] = useState(new SpeechSynthesisUtterance());
    const [voices, setVoices] = useState(null);

    /* for during exercise */
    const [distance, setDistance] = useState(0);
    const [displayDist, setDisplayDist] = useState("0.00");
    const [intervalsDone, setIntervalsDone] = useState(0);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [timeString, setTimeString] = useState("0h:00m:00s");

    /* for map */
    // const [bingmapKey, setBingMapKey] = useState("");
    const MAPBOX_TOKEN = "pk.eyJ1IjoienN3aW0iLCJhIjoiY2tlcTA2em5wMG5xejJyb2Y5NXppaG9nMiJ9.UG_bJB1XbFGN4-UZL98sWg";
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 14,
    })
    const [markerData, setMarkerData] = useState([])

    
    /* for after exercise */
    window.speechSynthesis.onvoiceschanged = function() {
        var voiceArray = speechSynthesis.getVoices();
        setVoices(voiceArray);
    }

    const changeScreen = (i) => {
        if(i===1){
            askLocation();
        } else if(i===2){
            finishTracking();
        } else {
            resetPage();
        }
        setScreen(i);
    }

    var firstTime = true;
    const askLocation = () => {
        var id, options;

        function success(pos){
            var coord = pos.coords;
            var lat = coord.latitude;
            var long = coord.longitude;

            if(firstTime){
                //console.log("start tracking");
                firstTime = false;
                var tempTime = new Date().getTime();
                setStartTime(tempTime);
            } else {
                var newDist = calcDistance(location, coord, currentUnit);
                var totalDist = distance + newDist;
                checkInterval(totalDist);
            }
            var currentLocation = {
                latitude: lat,
                longitude: long,
            }
            //console.log(currentLocation, location, (currentLocation === location));
            if(currentLocation !== location){
                setLocation({
                    latitude: lat,
                    longitude: long,
                });
            }

            if(!trackTime){
                navigator.geolocation.clearWatch(id);
            }
        }

        function error(err){
            alert('unable to get location data: ' + err.message);
        }

        options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000
        };
    
        id = navigator.geolocation.watchPosition(success, error, options);
    }

    const finishTracking = () => {
        if(isSoundOn){
            playSound('Exercise completed');
        }
        setTrackTime(false);
        addFinalMarker();
    }

    const resetPage = () => {

    }

    const addFinalMarker = () => {
        var classStr = "finalMarker";
        var pastMarkers = markerData;
        var markerKey = "marker" + pastMarkers.length;
        var markerPush = {
                            key: markerKey,
                            latitude: location.latitude, 
                            longitude: location.longitude,
                            classStr: classStr,
                        }
        pastMarkers.push(markerPush);
        console.log(pastMarkers);
        setMarkerData(pastMarkers);
    }

    const checkInterval = (totalDist) => {
        var nextInterval = (intervalsDone + 1) * getDistance();
        if(totalDist >= nextInterval){
            var intervalCount = intervalsDone + 1;
            // console.log(timeString);
            if(isSoundOn){
                var soundStr = "Distance: " + totalDist + ", Time: " + timeString // + ",  Split time: ";
                playSound(soundStr);
            }

            setIntervalsDone(intervalCount);

        }
        var distString = "";
        if(totalDist < 1){
            distString = "" + totalDist.toFixed(2);
        } else {
            distString = "" + totalDist.toFixed(1);
        }

        setDistance(totalDist);
        setDisplayDist(distString);
    }

    // const addInterval = () => {
    //     var totalDist = distance + getDistance();
    //     checkInterval(totalDist);
    // }

    const getDistance = () => {
        if(currentInterval === 1){
            return 1;
        } else if(currentInterval === 2){
            return 0.5;
        } else if(currentInterval === 3){
            return 0.25;
        } else {
            return 0.1;
        }
    }

    useEffect(() => {
        if(trackTime){
            var refreshId = setInterval(() => {

                var currentDate = new Date().getTime();
                // var startDate = startTime;

                updateTime(currentDate);

            }, 1000);
        }
        
        return () => {
            clearInterval(refreshId);
        };

    }, [trackTime]);

    useEffect(() => {
        // console.log("in here", location, screen, markerData);
        if(screen === 1){
            var classStr = "markerDiv";
            var pastMarkers = markerData;
            if(pastMarkers.length === 0){
                classStr = "initialMarker";
            }
            var markerKey = "marker" + pastMarkers.length;
            var markerPush = {
                                key: markerKey,
                                latitude: location.latitude, 
                                longitude: location.longitude,
                                classStr: classStr,
                            }
            pastMarkers.push(markerPush);
            // console.log(pastMarkers);
            setMarkerData(pastMarkers);
            setViewport({
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: viewport.zoom,
            })
        }
    }, [location])


    const updateTime = (currentDate) => {
        // console.log(markerData);
        var dif = Math.round((currentDate - startTime) / 1000);

        var hours = Math.floor(dif/3600);
        var leftovers1 = dif % 3600;
        var minutes = Math.floor(leftovers1 / 60);
        var minuteStr = "" + minutes;
        if(minutes < 10){
            minuteStr = "0" + minutes;
        }
        var seconds = leftovers1 % 60;
        var secondStr = "" + seconds;
        if(seconds < 10){
            secondStr = "0" + seconds;
        }

        var newTime = hours + "h:" + minuteStr + "m:" + secondStr + "s";
        setTimeString(newTime);
    }

    const playSound = (soundStr) => {
        var msg = message;
        var voiceArr = voices; // Note: some voices don't support altering params
        msg.voice = voiceArr[4];
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 0.9; // 0.1 to 10
        msg.pitch = 0; //0 to 2
        msg.lang = 'en-US';
    
        msg.text = soundStr;
        // console.log(soundStr);
    
        speechSynthesis.speak(msg);
    }
    
    const calcDistance = (crd1, crd2, unit) => {
        var lat1 = crd1.latitude;
        var long1 = crd1.longitude;
        var lat2 = crd2.latitude;
        var long2 = crd2.longitude;

        if ((lat1 === lat2) && (long1 === long2)) {
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
            if (unit==="Kilometers") { dist = dist * 1.609344 }
            return dist;
        }
    }

    const updateUnit = (newButton) => {
        var id = newButton.id;
        if(id === "mileButton" && unitButton2 === "primary"){
            setUButton1("primary");
            setUButton2("secondary");
            setCurrentUnit("Miles");
            setDisplayUnit("Mi");
        } else if(id === "kmButton" && unitButton1 === "primary"){
            setUButton2("primary");
            setUButton1("secondary");
            setCurrentUnit("Kilometers");
            setDisplayUnit("KM");
        } else {
            //do nothing
        }
    }

    const updateSound = (newButton) => {
        var id = newButton.id;
        if(id === "soundOnButton" && soundButton2 === "danger"){
            setSButton1("success");
            setSButton2("secondary");
            setSound(true);
        } else if(id === "soundOffButton" && soundButton1 === "success"){
            setSButton2("danger");
            setSButton1("secondary");
            setSound(false);
        } else {
            //do nothing
        }
    }

    const updateInterval = (newButton) => {
        var id = "" + newButton.id;
        var idNum = parseInt(id.substring(id.length-1));
        if(currentInterval === 1){
            if(idNum === 4){
                setIButton1("secondary");
                setIButton4("primary");
                setCurrentInterval(4);
            } else if(idNum === 3){
                setIButton1("secondary");
                setIButton3("primary");
                setCurrentInterval(3);
            } else if(idNum === 2){
                setIButton1("secondary");
                setIButton2("primary");
                setCurrentInterval(2);
            }
        } else if(currentInterval === 2){
            if(idNum === 4){
                setIButton2("secondary");
                setIButton4("primary");
                setCurrentInterval(4);
            } else if(idNum === 3){
                setIButton2("secondary");
                setIButton3("primary");
                setCurrentInterval(3);
            } else if(idNum === 1){
                setIButton2("secondary");
                setIButton1("primary");
                setCurrentInterval(1);
            }
        } else if(currentInterval === 3){
            if(idNum === 4){
                setIButton3("secondary");
                setIButton4("primary");
                setCurrentInterval(4);
            } else if(idNum === 3){
                setIButton3("secondary");
                setIButton1("primary");
                setCurrentInterval(1);
            } else if(idNum === 2){
                setIButton3("secondary");
                setIButton2("primary");
                setCurrentInterval(2);
            }
        } else if(currentInterval === 4){
            if(idNum === 1){
                setIButton4("secondary");
                setIButton1("primary");
                setCurrentInterval(1);
            } else if(idNum === 3){
                setIButton4("secondary");
                setIButton3("primary");
                setCurrentInterval(3);
            } else if(idNum === 2){
                setIButton4("secondary");
                setIButton2("primary");
                setCurrentInterval(2);
            }
        }

    }


    return(
        (screen === 0) ? 
            <div id="beforeStart" className="contentHolder">
                <div id="mainHeader">
                    Exercise!
                </div>
                <div className="sectionHeader">
                    Select an unit for distance
                </div>
                <div id="unitRadios" className="radioSection">
                    <Button id="mileButton" variant={unitButton1} onClick={e => updateUnit(e.target)}>Miles</Button>
                    <Button id="kmButton" variant={unitButton2} onClick={e => updateUnit(e.target)}>Kilometers</Button>
                </div>
                <div className="sectionHeader">
                        Select an interval for distance
                    </div>
                <div id="selectInterval" className="radioSection">
                    <Button id="intervalButton1" variant={intervalButton1} onClick={e => updateInterval(e.target)} >1.0</Button>
                    <Button id="intervalButton2" variant={intervalButton2} onClick={e => updateInterval(e.target)} >0.5</Button>
                    <Button id="intervalButton3" variant={intervalButton3} onClick={e => updateInterval(e.target)} >0.25</Button>
                    <Button id="intervalButton4" variant={intervalButton4} onClick={e => updateInterval(e.target)} >0.1</Button>
                </div>
                <div className="sectionHeader">
                    Sound Settings
                </div>
                <div id="unitRadios" className="radioSection">
                    <Button id="soundOnButton" variant={soundButton1} onClick={e => updateSound(e.target)}>On</Button>
                    <Button id="soundOffButton" variant={soundButton2} onClick={e => updateSound(e.target)}>Off</Button>
                </div>
                <Button id="startButton" variant="success" onClick={() => changeScreen(1)}>Start Exercise</Button>
            </div>
        : (screen === 1) ?
            <div id="duringExercise" className="contentHolder">
                <div className="timeLabel">
                    <div className="timeHeader">Time: <span id="time">{timeString}</span></div>
                </div>
                <div className="distanceLabel">
                    <div className="distanceHeader">Distance: <span id="distance">{displayDist} {displayUnit}</span></div>
                </div>
                {/* <div id="intervalTimes" className="hidden">
                    <div id="intervalHeader">Split Times</div>
                    
                </div> */}
                {/* <button id="addDistance" onClick={() => addInterval()}>Add Distance</button> */}
                <Button id="finishButton" variant="danger" onClick={() => changeScreen(2)}>End Exercise</Button>

                <div id="mapSpace">
                    
                    <ReactMapGL
                        {...viewport} onViewportChange={nextViewport => setViewport(nextViewport)}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        width="100%"
                        height="100%"
                        id="mapView"
                    >

                        {/* <Marker 
                            latitude={location.latitude} 
                            longitude={location.longitude}
                        >
                            <div className="markerDiv"></div>
                        </Marker> */}
                        {markerData.map(
                            point => <Marker key={point.key} longitude={point.longitude} latitude={point.latitude}><div className={point.classStr}></div></Marker>
                        )}
                    </ReactMapGL>
                </div>
            </div>
        : 
            <div id="afterFinish" className="contentHolder">
                <div id="summaryHeader">Exercise Summary</div>
                <div className="timeLabel">
                    <div className="timeHeader">Time: <span id="timeHolder">{timeString}</span></div>
                </div>
                <div className="distanceLabel">
                    <div className="distanceHeader">Distance: <span id="distanceHolder">{displayDist} {displayUnit}</span></div>
                </div>
                {/* <div id="pace">Pace: <span id="paceHolder"></span></div> */}
                
                
                {/* <div id="splits">
                    <div id="splitHeader">
                        Split times
                    </div>
                    <div id="splitContent">
                    </div>
                </div> */}


                {/* <button id="home" onClick={() => changeScreen(0)}>Reset Page</button> */}
                <div id="mapSpace">
                    
                    <ReactMapGL
                        {...viewport} onViewportChange={nextViewport => setViewport(nextViewport)}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        width="100%"
                        height="100%"
                        id="mapView"
                    >

                        {/* <Marker 
                            latitude={location.latitude} 
                            longitude={location.longitude}
                        >
                            <div className="markerDiv"></div>
                        </Marker> */}
                        {markerData.map(
                            point => <Marker key={point.key} longitude={point.longitude} latitude={point.latitude}><div className={point.classStr}></div></Marker>
                        )}
                    </ReactMapGL>
                </div>
            </div>
    );
}

export default Exercise;