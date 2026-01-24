import { DataStructure } from "../../dataStructure";

export class Percentile {
    data;
    value;
    snapshot;

    constructor(data) {
        this.data = data;
        this.percentileObject = [];
        this.percentileObjectSorted = [];
    }

    convertRawToObject() {
        //percentile object recieves the keys
        this.percentileObject.push(Object.keys(Object.values(this.data[0])[0]))
        //iterating over each bot
        for (let i = 0; i < this.data.length; i++) {
            //gets all datapoint keys
            let keys = Object.keys(Object.values(this.data[i])[0])
            let robotAverage = []
            //uses datapoint keys to grab all values of those datapoints
            for (let j = 0; j < keys.length; j++) {
                let matches = Object.values(this.data[i])
                let total = 0;
                for (let k = 0; k < matches.length; k++) {
                    let data_value = matches[k][keys[j]]
                    if (data_value == "true") {
                        data_value = 1
                    } else if (data_value == "false") {
                        data_value = 0
                    } else if (!isNaN(Number(data_value))) {
                        data_value = Number(data_value);
                    } else if (isNaN(data_value)) {
                        //do nothing
                    }
                    total = total + data_value;

                }
                //averages the datapoints
                robotAverage.push(total / matches.length);
            }
            //pushes an array of all the averages of that robot
            this.percentileObject.push(robotAverage);

        }
        return (this);
    }
    processObjectData() {
        // use DataStructure labels to compute processed stats (avoids hardcoded label names)
        const ds = new DataStructure();
        const autoLabels = ds.getFilterLabelsAuto();
        const teleLabels = ds.getFilterLabelsTele();
        const autoPts = ds.getAutoPtValues();
        const telePts = ds.getTelePtValues();
        // add processed field names matching DataStructure spider labels
        this.percentileObject[0].push("Auto Points", "Tele Points", "Endgame Points")
        // iterate through each bot to compute processed values
        for (let i = 1; i < this.percentileObject.length; i++) {
            // compute auto points
            let auto_sum = 0;
            for (let j = 0; j < autoLabels.length; j++) {
                let idx = this.percentileObject[0].indexOf(autoLabels[j]);
                let val = idx >= 0 ? this.percentileObject[i][idx] : 0;
                let weight = autoPts[j] || 0;
                auto_sum += val * weight;
            }
            this.percentileObject[i].push(auto_sum);

            // compute tele points
            let tele_sum = 0;
            for (let j = 0; j < teleLabels.length; j++) {
                let idx = this.percentileObject[0].indexOf(teleLabels[j]);
                let val = idx >= 0 ? this.percentileObject[i][idx] : 0;
                let weight = telePts[j] || 0;
                tele_sum += val * weight;
            }
            this.percentileObject[i].push(tele_sum);

            // endgame points: try to find "Climb" or "Endgame Climb" label
            let endIdx = this.percentileObject[0].indexOf("Climb");
            if (endIdx < 0) endIdx = this.percentileObject[0].indexOf("Endgame Climb");
            let endgame_pts = endIdx >= 0 ? this.percentileObject[i][endIdx] : 0;
            this.percentileObject[i].push(endgame_pts);
        }
        return this;
    }
    sortPercentile() {
        let keys = this.percentileObject[0];
        for(let i=0; i<keys.length; i++){
            let sorted_arr = []
            for(let j=1; j<this.percentileObject.length-1; j++){
                sorted_arr.push(this.percentileObject[j][i])
            }
            sorted_arr.sort(function(a, b) {
                return a - b;
            });
            this.percentileObjectSorted[this.percentileObject[0][i]] = sorted_arr
        }
        //console.log(this.percentileObjectSorted);
        return this;
    }
    findAverageOfTeam(team){
        let key = this.percentileObject[0].indexOf("Team")
        console.log(key)
        console.log(this.percentileObject)

        for(let i=1; i<this.percentileObject.length; i++){
            if(this.percentileObject[i][key] == team){
                return this.percentileObject[i];
            }
        }
        alert("Team not found for average")
        return "Error: team not found"
    }
    findPercentileOf(val, name) {
        for (let i = 0; i < this.percentileObjectSorted[name].length; i++) {
            if (this.percentileObjectSorted[name][i] > val) {
                return (i / this.percentileObjectSorted[name].length);
            }
        }
    }

    returnData() {
        return this.data;
    }
    addNewMatchToPercentile(snapshot) {

    }
    updateData(data) {
        this.data = data;
    }

}