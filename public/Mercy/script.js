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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const encoder = new Encoder();
const dataStructure = new DataStructure();

let eventName;
let api_url;
let toggleTBA = false;
//let availPaths = ["2025wimu", "2025txwac"];
let availPaths = ["2025txcpl"];
let firebasePath = localStorage.getItem('firebasePath');

function promptForPath(defaultVal) {
  let valid = true;
  let userInput;
  while (valid) {
    userInput = prompt('Please enter a firebase path:', defaultVal);
    if (!userInput) continue;
    userInput = userInput.toLowerCase();
    if (availPaths.includes(userInput)) valid = false;
  }
  return userInput;
}

let userInput = firebasePath ? promptForPath(firebasePath) : promptForPath("");
if (userInput.includes("practice")) toggleTBA = true;
dataStructure.setFirebasePath("Events/" + userInput + "/");
eventName = userInput;
localStorage.setItem('firebasePath', userInput);

api_url = `https://www.thebluealliance.com/api/v3/event/${eventName}/matches?X-TBA-Auth-Key=vyLPDCJ6TJZgpdVmZkszbUI65Bdz4eqjYIEm4KjCAOENr4WXCyn1oMOHi5bFW2er`;

var netStatus;
let inputs = 0;
let pageChange = new SwitchPage();
document.querySelectorAll(".nav-container").forEach((el) => {
  el.addEventListener("click", () => {
    pageChange.switchEvent(el.getAttribute("name"));
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    pageChange.toggleState ? pageChange.hidePanel() : pageChange.showPanel();
    pageChange.toggleState = !pageChange.toggleState;
  }
});

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
  if (all_data === "") {
    document.getElementById("status").innerHTML =
        "Empty Push, Upload Not Registered";
    return;
  }

  let rows = all_data.split(/\n/);
  let sorted_data = [];

  const labels = dataStructure.getDataLabels();
  const types = dataStructure.getDataTypes();

  for (let i = 0; i < rows.length; i++) {
    if (rows[i] === "") continue;

    let data = rows[i].split(",").map(v => v.trim());

    if (data[0].length < 2) data[0] = "0" + data[0];

    if (data.length !== labels.length) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Length<br>`;
      continue;
    }

    if (!/^\d+$/.test(data[0])) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Match<br>`;
      continue;
    }

    if (!/^\d+$/.test(data[1]) || data[1].length > 4) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Team<br>`;
      continue;
    }

    if (!["b1","b2","b3","r1","r2","r3"].includes(data[2])) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Position<br>`;
      continue;
    }
    if(['right', 'left', 'middle'].indexOf(data[4]) === -1){
      document.getElementById("status").innerHTML += `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid StartingPosition<br>`;
      continue;
    }


    let invalid = "";
    let valid = true;

    for (let j = 5; j < 30; j++) {
      if (types[j] !== "number") continue;

      if (!/^\d+$/.test(data[j])) {
        valid = false;
        invalid += `index ${j + 1}, value ${data[j]}, or ${labels[j]}<br>`;
      }
    }

    if (!valid) {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${data[0]}-${data[2]}-${data[3]}: Invalid Qualitative Data For:<br>${invalid}<br>`;
      continue;
    }
    let cache = localStorage.getItem("dataCache") || "";
    cache += rows[i] + "\n";
    localStorage.setItem("dataCache", cache);
    sorted_data.push(data);
  }
  for (let data of sorted_data) {
    let formatted = encoder.rawDataToFormattedData(data, labels);
    let status = encoder.uploadFormattedData(db, formatted, dataStructure);

    if (status === true) {
      document.getElementById("status").innerHTML +=
          `Successful Upload for ${formatted.Match}-${formatted.Position}-${formatted.Scout}<br>`;
    } else {
      document.getElementById("status").innerHTML +=
          `Failed Upload for ${formatted.Match}-${formatted.Position}-${formatted.Scout}: ${status}<br>`;
    }
  }
}

document.getElementById("button").addEventListener("click", uploadData);
document.getElementById("download").addEventListener("click", () => {
  let cache = localStorage.getItem("dataCache");
  if (!cache) return;

  let a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(cache);
  a.download = "mercyCache.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.getElementById("cleardown").addEventListener("click", () => {
  localStorage.setItem("dataCache", "");
});

function internetOnline() {
  netStatus = true;
  document.getElementById("wifiON").style.display = "block";
  document.getElementById("wifiOFF").style.display = "none";
}

function internetOffline() {
  netStatus = false;
  document.getElementById("wifiOFF").style.display = "block";
  document.getElementById("wifiON").style.display = "none";
}

navigator.onLine ? internetOnline() : internetOffline();
window.addEventListener("online", internetOnline);
window.addEventListener("offline", internetOffline);

