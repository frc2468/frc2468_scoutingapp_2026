// mercy/script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase, ref, child, get, onChildAdded, onValue, set, remove
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { Encoder } from '../encoder.js';
import { DataStructure } from '../dataStructure.js';
import { SwitchPage } from "./modules/switchPage.js";
import Hammer from 'hammerjs';

const firebaseConfig = {
  apiKey: "AIzaSyBvN_v9pz5KFshemssxm-cb8R2vTviGkOs",
  authDomain: "scouting-app-d8a4d.firebaseapp.com",
  databaseURL: "https://scouting-app-d8a4d-default-rtdb.firebaseio.com",
  projectId: "scouting-app-d8a4d",
  storageBucket: "scouting-app-d8a4d.firebasestorage.app",
  messagingSenderId: "1009813900313",
  appId: "1:1009813900313:web:a7c0ac40ee0e4cf0eeae88"
};
let inputs;
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const encoder = new Encoder();
const dataStructure = new DataStructure();

let eventName;
let API_URL;
let toggleTBA = false;
//let defaultFirebasePath = ["2025wimu", "2025txwac"];
let defaultFirebasePath = ["2025txcmp1"];
let firebasePath = localStorage.getItem('firebasePath');

function promptForPath(defaultVal) {
  //This function creates a pop-up window so your can type what Firebase Path the user wants to use
  //It only accepts the once in defaultFirebasePath
  let valid = true;
  let userInput;
  while (valid) {
    userInput = prompt('Please enter a firebase path:', defaultVal);
    if (!userInput) continue;
    userInput = userInput.toLowerCase();
    if (defaultFirebasePath.includes(userInput)) {
      valid = false;
    }
  }
  return userInput;
}

eventName = firebasePath ? promptForPath(firebasePath) : promptForPath("");
if (eventName.includes("practice")) {
  toggleTBA = true;
}
dataStructure.setFirebasePath("Events/" + eventName + "/");
localStorage.setItem('firebasePath', eventName);
API_URL = `https://www.thebluealliance.com/api/v3/event/${eventName}/matches?X-TBA-Auth-Key=vyLPDCJ6TJZgpdVmZkszbUI65Bdz4eqjYIEm4KjCAOENr4WXCyn1oMOHi5bFW2er`;

let netStatus;
//let inputs = 0; NOT BEING USED
let pageChange = new SwitchPage();
document.querySelectorAll(".nav-container").forEach((el) => {
  el.addEventListener("click", () => {
    pageChange.switchEvent(el.getAttribute("name"));
  });
});
/*
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    pageChange.toggleState ? pageChange.hidePanel() : pageChange.showPanel();
    pageChange.toggleState = !pageChange.toggleState;
  }
});
*/
pageChange.switchEvent("upload");

let hammer = new Hammer(document.body);
if ("ontouchstart" in window) {
  hammer.on("doubletap", () => {
    pageChange.toggleState ? pageChange.hidePanel() : pageChange.showPanel();
    pageChange.toggleState = !pageChange.toggleState;
  });
}
function uploadData() {
  document.getElementById("status").innerHTML = "";

  if (!netStatus) {
    document.getElementById("status").innerHTML =
        "Failed Internet Connection Test: Upload Not Registered";
    return;
  }

  let all_data = document.getElementById("input").value;
  if (!all_data || all_data === "") {
    //returns a status update if the input given by the user is empty
    document.getElementById("status").innerHTML =
        "Empty Push, Upload Not Registered";
    return;
  }
  //splits all the inputted data, to create a list of independent variables
  let rows = all_data.split(/\n/);
  // Getting the correct Data Labels and Data Types from dataStructure.js
  const labels = dataStructure.getDataLabels();
  const types = dataStructure.getDataTypes();
  //Loops through each row in a rows so we can split by comma
  for (let row of rows) {
    if (!row.trim) {
      continue;
    }
    //splitting each row everytime we see a comma
    let data = row.split(",").map(v => v.trim());

    if (data.length !== labels.length) {
      /*
      Checking if the length of the data we have corresponds with the length that we expected to get
      If it doesn't we print out an error
       */
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Length<br>`;
      continue;
    }
    let formatted = encoder.rawDataToFormattedData(data, labels);
    try {
      let invalid = "";
      let valid = true;
      //Checking the data itself
      for (let j = 0; j < data.length; j++) {
        //checking each segment
        if (j === 0 || j === 1 || j === 2 || j === 3 || j === 4) {
          //checking the first five variables manually, to see if they met the standards
          if (!/^\d+$/.test(data[0]) ) {
            //Checking the match number
            valid = false;
            document.getElementById("status").innerHTML +=
                `Invalid Match for ${data[0]}-${data[2]}-${data[3]}<br>`;
            break;
          }
          if (!/^\d+$/.test(data[1])) {
            //Checking the Team Number
            valid = false;
            document.getElementById("status").innerHTML +=
                `Invalid Team for ${data[0]}-${data[2]}-${data[3]}<br>`;
            break;
          }
          if (!["b1","b2","b3","r1","r2","r3"].includes(data[2])) {
            //Checking that the position is one of the once we wanted (aka "b1","b2","b3","r1","r2","r3")
            valid = false;
            document.getElementById("status").innerHTML +=
                `Invalid Position for ${data[0]}-${data[2]}-${data[3]}<br> Please write b1, b2, b3, r1, r2, r3<br>`;
            break;
          }
          if (!/^\d+$/.test(data[3]) || data[3].length !== 5) {
            //Checking that the lunch number is five digits long number
            valid = false;
            document.getElementById("status").innerHTML +=
                `Invalid Scout for ${data[0]}-${data[2]}-${data[3]}<br> Please write you lunch number<br> Example: 12345<br>`;
            break;
          }
          if (['right', 'left', 'middle'].indexOf(data[4]) === -1) {
            //Checking that the position is one of the once we wanted (aka 'right', 'left', 'middle')
            valid = false;
            document.getElementById("status").innerHTML +=
                `Invalid StartingPosition for ${data[0]}-${data[2]}-${data[3]}<br> Please write middle, left, right<br>`;
            break;
          }
        } else {
          //checking the rest of the data to see if it corresponds with the data type we wanted

          // number validation
          if (types[j] === "number") {
            if (!/^\d+$/.test(data[j])) {
              valid = false;
              invalid += `index ${j + 1} (${labels[j]}), value "${data[j]}" is not a number<br>`;
            }
          }
          // string validation
          if (types[j] === "string") {
            if (data[j].trim() === "" || /^\d+$/.test(data[j])) {
              valid = false;
              invalid += `index ${j + 1} (${labels[j]}), value "${data[j]}" is not a string<br>`;
            }
          }

        }
      }
      if (!valid) {
        document.getElementById("status").innerHTML +=
            `Failed Upload for ${data[0]}-${data[2]}-${data[3]}:<br>${invalid}<br>`;
        continue;
      }
      const path = dataStructure.getPath("Matches");
      const key = `${formatted.Match}-${formatted.Position}-${formatted.Scout}`;
      set(child(ref(db, path), key), formatted);
      document.getElementById("status").innerHTML +=
          `Successful Upload for ${key}<br>`;
    } catch (err) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${formatted.Match}: ${err.message}<br>`;
    }
  }
}

document.getElementById("button").addEventListener("click", uploadData);

function download(){
  let cache = localStorage.getItem("dataCache");
  if(!cache){
    return;
  }
  let fileName = "mercyCache.txt";
  var element = document.createElement('a');
  element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(cache));
  element.setAttribute('download', fileName);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

document.getElementById("download").addEventListener("click", download);

function clearDownload(){
  localStorage.setItem("dataCache", "");
}

document.getElementById("cleardown").addEventListener("click", clearDownload);

function internetOnline(){
  netStatus = true;
  document.getElementById("wifiON").style.display = "block";
  document.getElementById("wifiOFF").style.display = "none";
  console.log("online");
}

function internetOffline(){
  netStatus = false;
  document.getElementById("wifiOFF").style.display = "block";
  document.getElementById("wifiON").style.display = "none";
  console.log("offline");
}

window.navigator.onLine ? internetOnline() : internetOffline();
window.addEventListener('online', internetOnline);
window.addEventListener('offline', internetOffline);

let textBox = document.getElementById('input');
textBox.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    let audioSrc;
    /*
    switch(inputs){
      case 0: audioSrc = 'sfx/Spectrum_Kill_1.mp3.mp3'; inputs++; break;
      case 1: audioSrc = 'sfx/Spectrum_Kill_2.mp3.mp3'; inputs++; break;
      case 2: audioSrc = 'sfx/Spectrum_Kill_3.mp3.mp3'; inputs++; break;
      case 3: audioSrc = 'sfx/Spectrum_Kill_4.mp3.mp3'; inputs++; break;
      case 4: audioSrc = 'sfx/Spectrum_Kill_5.mp3.mp3'; inputs++; break;
      case 5: audioSrc = 'sfx/Spectrum_Kill_6.mp3.mp3'; inputs++; break;
      default: audioSrc = 'sfx/Spectrum_Kill_6.mp3.mp3';
    }
    */
    const audio = new Audio(audioSrc);
    audio.play();
  }
});

function clear(){
  document.getElementById('input').value = '';
  let inputs;
  inputs = 0;
}

document.getElementById("clear").addEventListener("click", clear);

let setPath = dataStructure.getPath("/" + "Matches-TBA");
var storedData = {};
let dataLabels = dataStructure.getDataLabels();

onChildAdded(ref(db, setPath), (snapshot) => {
  let instance = snapshot.val();
  let finalPath = dataStructure.getPath("Final/Matches/" + instance["Match"] + "-" + instance["Position"]);
  get(ref(db, finalPath)).then((snapshot) => {
    var data = snapshot.val();
    let match = "" + instance["Match"] + "-" + instance["Position"];
    if (data != null && data["Scout"].includes(instance["Scout"])) {
      if (storedData[match] === undefined) {
        storedData[match] = [];
      }
      let newScout = true;
      for (let i = 0; i < storedData[match].length; i++) {
        if (storedData[match][i]["Scout"] === instance["Scout"]) newScout = false;
      }
      if (newScout) storedData[match].push(instance);
    } else {
      if (storedData[match] === undefined) {
        storedData[match] = [];
      }
      for (let i = 0; i < storedData[match].length; i++) {
        if (storedData[match][i]["Scout"] === instance["Scout"]) {
          return;
        }
      }
      storedData[match].push(Object.assign({}, instance));
      let replace = {};
      replace["Scout"] = [];
      for(let i = 0; i < dataLabels.length; i++){
        if (dataLabels[i] === "Position" || dataLabels[i] === "Match" || dataLabels[i] === "Team") {
          replace[dataLabels[i]] = storedData[match][0][dataLabels[i]];
          continue;
        } else if (dataLabels[i] === "Scout") {
          for (let j = 0; j < storedData[match].length; j++) {
            replace[dataLabels[i]].push(storedData[match][j][dataLabels[i]]);
          }
          continue;
        } else if (dataLabels[i] === "Intake QATA" || dataLabels[i] === "Climb QATA" || dataLabels[i] === "QATA") {
          let combinedQATA = "";
          for (let j = 0; j < storedData[match].length; j++) {
            combinedQATA += storedData[match][j][dataLabels[i]];
            if (j < storedData[match].length - 1) combinedQATA += ", ";
          }
          replace[dataLabels[i]] = combinedQATA;
          continue;
        }
        let sum = 0;
        let countVals = 0;
        for (let j = 0; j < storedData[match].length; j++) {
          sum += parseInt(storedData[match][j][dataLabels[i]]);
          countVals += 1;
        }
        replace[dataLabels[i]] = "" + (sum / countVals).toFixed(0);
      }

      let pushPath = dataStructure.getPath("Final" + "/" + "Matches") + match + "/";
      remove(ref(db, pushPath), replace);
      set(child(ref(db, dataStructure.getPath("Final/Matches")), match), replace);

      pushPath = dataStructure.getPath("Final" + "/" + "Robots") + instance["Team"] + '/';
      set(child(ref(db, pushPath), instance["Match"]), replace);
    }
  });
});

// Periodic API update for TBA data
let TBAGrabber = setInterval(() => { getapi(API_URL); }, 30000);
let TBABypass;

if(toggleTBA){
  clearInterval(TBAGrabber);
  TBABypass = setInterval(() => { directUpload(); }, 30000);
}

function toggle(){
  if(toggleTBA){
    toggleTBA = false;
    clearInterval(TBABypass);
    TBAGrabber = setInterval(() => { getapi(API_URL); }, 30000);
    document.getElementById("TBAtoggle").innerHTML = "TBA: ON";
  } else {
    toggleTBA = true;
    clearInterval(TBAGrabber);
    TBABypass = setInterval(() => { directUpload(); }, 30000);
    document.getElementById("TBAtoggle").innerHTML = "TBA: OFF";
  }
}

document.getElementById("TBAtoggle").addEventListener("click", toggle);

function directUpload(){
  let setPath = dataStructure.getPath("/" + "Matches");
  get(ref(db, setPath)).then((snapshot) => {
    if(snapshot.val() == null){
      console.log("No Uploads");
      return;
    }
    let matches = snapshot.val();
    let matches_key = Object.keys(matches);
    for(let i=0; i < matches_key.length; i++){
      let match = matches[matches_key[i]];
      let setPath = dataStructure.getPath("Matches-TBA");
      remove(ref(db, setPath + match["Match"] + "-" + match["Position"] + "-" + match["Scout"] + "/"), match);
      set(child(ref(db, setPath), (match["Match"] + "-" + match["Position"] + "-" + match["Scout"] + "/")), match);
    }
  });
}

async function getapi(url) {
  const response = await fetch(url);
  if (response == null) {
    console.log("No TBA Data");
    return;
  }

  const allData = await response.json();

  let availMatches = [];
  console.log(allData);

  for (let i = 0; i < allData.length; i++) {
    let data = allData[i];
    if (data.comp_level == "sf") {
      data.match_number = data.set_number + 200;
    } else if (data.comp_level == "f") {
      data.match_number += 300;
    }
    if (data.match_number < 10) {
      data.match_number = "0" + data.match_number;
    }
    data.match_number = String(data.match_number);
    availMatches.push(data.match_number);
  }

  let setPath = dataStructure.getPath("/" + "Matches");
  get(ref(db, setPath)).then((snapshot) => {
    if (snapshot.val() == null) {
      console.log("No Uploads");
      return;
    }
    let matches = snapshot.val();
    let matches_key = Object.keys(matches);
    for (let i = 0; i < matches_key.length; i++) {
      if (availMatches.indexOf(matches[matches_key[i]]["Match"]) != -1) {
        let index = availMatches.indexOf(matches[matches_key[i]]["Match"]);
        let match = matches[matches_key[i]];
        let alliances = allData[index].alliances;
        let scores = allData[index].score_breakdown;

        if (match["Position"][0] == "b") {
          match["Team"] = (alliances.blue.team_keys[Number(match["Position"][1]) - 1]).substr(3);

          if (Number(match["Position"][1]) == 1) {
            match["Mobility"] = scores.blue.mobilityRobot1;
            match["Auto Climb"] = scores.blue.autoChargeStationRobot1;
            match["Climb"] = scores.blue.endGameChargeStationRobot1;
          } else if (Number(match["Position"][1]) == 2) {
            match["Mobility"] = scores.blue.mobilityRobot2;
            match["Auto Climb"] = scores.blue.autoChargeStationRobot2;
            match["Climb"] = scores.blue.endGameChargeStationRobot2;
          } else {
            match["Mobility"] = scores.blue.mobilityRobot3;
            match["Auto Climb"] = scores.blue.autoChargeStationRobot3;
            match["Climb"] = scores.blue.endGameChargeStationRobot3;
          }

          match["Mobility"] = match["Mobility"] === "Yes" ? "1" : "0";

          if (match["Auto Climb"] == "None") {
            match["Auto Climb"] = "0";
          } else {
            match["Auto Climb"] = scores.blue.autoBridgeState == "Level" ? "12" : "8";
          }

          if (match["Climb"] == "None") {
            match["Climb"] = "0";
          } else if (match["Climb"] == "Park") {
            match["Climb"] = "2";
          } else {
            match["Climb"] = scores.blue.endGameBridgeState == "Level" ? "10" : "6";
          }
        } else {
          match["Team"] = (alliances.red.team_keys[Number(match["Position"][1]) - 1]).substr(3);

          if (Number(match["Position"][1]) == 1) {
            match["Mobility"] = scores.red.mobilityRobot1;
            match["Auto Climb"] = scores.red.autoChargeStationRobot1;
            match["Climb"] = scores.red.endGameChargeStationRobot1;
          } else if (Number(match["Position"][1]) == 2) {
            match["Mobility"] = scores.red.mobilityRobot2;
            match["Auto Climb"] = scores.red.autoChargeStationRobot2;
            match["Climb"] = scores.red.endGameChargeStationRobot2;
          } else {
            match["Mobility"] = scores.red.mobilityRobot3;
            match["Auto Climb"] = scores.red.autoChargeStationRobot3;
            match["Climb"] = scores.red.endGameChargeStationRobot3;
          }

          match["Mobility"] = match["Mobility"] === "Yes" ? "1" : "0";

          if (match["Auto Climb"] == "None") {
            match["Auto Climb"] = "0";
          } else {
            match["Auto Climb"] = scores.red.autoBridgeState == "Level" ? "12" : "8";
          }

          if (match["Climb"] == "None") {
            match["Climb"] = "0";
          } else if (match["Climb"] == "Park") {
            match["Climb"] = "2";
          } else {
            match["Climb"] = scores.red.endGameBridgeState == "Level" ? "10" : "6";
          }
        }

        let setPath = dataStructure.getPath("Matches-TBA");
        remove(ref(db, setPath + match["Match"] + "-" + match["Position"] + "-" + match["Scout"] + "/"), match);
        set(child(ref(db, setPath), (match["Match"] + "-" + match["Position"] + "-" + match["Scout"] + "/")), match);
      }
    }
  });

}