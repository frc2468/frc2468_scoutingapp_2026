import { DataStructure } from "./data_structures.js";
import { getDatabase, ref, get } from "firebase/database";

// Initialize the data model
const ds = new DataStructure();
const db = ds.getFireBase();

// -------------------------------
// Load ALL robots from Firebase
// -------------------------------
async function loadAllRobots() {
    const path = ds.getPath("Matches");
    const snapshot = await get(ref(db, path));

    if (!snapshot.exists()) {
        console.error("No robot data found");
        return {};
    }

    return snapshot.val(); // returns { teamNumber: { match1: {...}, match2: {...} } }
}

// -------------------------------
// Build a dynamic table
// -------------------------------
function buildRobotTable(robotData) {
    const labels = ds.getDataLabels();
    const table = document.getElementById("robotTable");

    // Clear old table
    table.innerHTML = "";

    // Header row
    const headerRow = document.createElement("tr");
    labels.forEach(label => {
        const th = document.createElement("th");
        th.textContent = label;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Data rows
    Object.keys(robotData).forEach(team => {
        const matches = robotData[team];
        Object.keys(matches).forEach(matchKey => {
            const row = document.createElement("tr");
            const match = matches[matchKey];

            labels.forEach(label => {
                const td = document.createElement("td");
                td.textContent = match[label] ?? "";
                row.appendChild(td);
            });

            table.appendChild(row);
        });
    });
}

// -------------------------------
// Compute averages for each robot
// -------------------------------
function computeRobotAverages(robotData) {
    const filterLabels = ds.getFilterLabels();

    Object.keys(robotData).forEach(team => {
        const matches = robotData[team];
        ds.calcRobotPtAvgs(filterLabels, matches);
    });

    console.log("Robot averages:", ds.getStoredRobotsAvgPtVals());
    console.log("Total point averages:", ds.getStoredRobotsTotalPtAvg());
}

// -------------------------------
// Prepare spider chart data
// -------------------------------
function buildSpiderChartData(robotMatches) {
    const autoPts = ds.calcAvgAutoPts(robotMatches);
    const telePts = ds.calcAvgTelePts(robotMatches);

    return {
        labels: ds.getSpiderChartLabels(),
        values: [
            autoPts,
            telePts,
            0, // Endgame placeholder
            0  // Defense placeholder
        ]
    };
}

// -------------------------------
// Main entry point
// -------------------------------
async function main() {
    const robots = await loadAllRobots();

    buildRobotTable(robots);
    computeRobotAverages(robots);

    if (robots["1234"]) {
        const spiderData = buildSpiderChartData(robots["1234"]);
        console.log("Spider chart data:", spiderData);
    }
}

main();
