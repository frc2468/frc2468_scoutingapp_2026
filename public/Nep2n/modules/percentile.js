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
        //processes additional data from existing datapoints, for example, auto points is processed from auto climb + auto objects placed
        this.percentileObject[0].push("Auto Points", "Tele Accuracy", "Tele Cones", "Tele Cubes", "Endgame Points")
        //iterates through each bot to figure out their processed data
        for(let i=1; i<this.percentileObject.length; i++){
            //calculates auto points
            let auto_l4 = this.percentileObject[i][this.percentileObject[0].indexOf("Auto L4")]
            let auto_l3 = this.percentileObject[i][this.percentileObject[0].indexOf("Auto L3")]
            let auto_l2 = this.percentileObject[i][this.percentileObject[0].indexOf("Auto L2")]
            let auto_l1 = this.percentileObject[i][this.percentileObject[0].indexOf("Auto L1")]
            let auto_process = this.percentileObject[i][this.percentileObject[0].indexOf("Auto Processor")]
            let auto_net = this.percentileObject[i][this.percentileObject[0].indexOf("Auto Net")]

            let auto_pts = auto_l4 * 7 + auto_l3 * 6 + auto_l2 * 4 + auto_l1 * 3 + auto_process * 6 + auto_net * 4
            this.percentileObject[i].push(auto_pts)

            //calculates the accuracy, or how much the team fumbles
            let tele_l4 = this.percentileObject[i][this.percentileObject[0].indexOf("Tele L4")]
            let tele_l3 = this.percentileObject[i][this.percentileObject[0].indexOf("Tele L3")]
            let tele_l2 = this.percentileObject[i][this.percentileObject[0].indexOf("Tele L2")]
            let tele_l1 = this.percentileObject[i][this.percentileObject[0].indexOf("Tele L1")]
            let tele_process = this.percentileObject[i][this.percentileObject[0].indexOf("Tele Processor")]
            let tele_net = this.percentileObject[i][this.percentileObject[0].indexOf("Tele Net")]
            let tele_fumbled = this.percentileObject[i][this.percentileObject[0].indexOf("T Fumbled")]
            let tele_acc = (tele_l4 + tele_l3 + tele_l2 + tele_l1 + tele_process + tele_net)/(tele_l4 + tele_l3 + tele_l2 + tele_l1 + tele_process + tele_net + tele_fumbled)
            this.percentileObject[i].push(tele_acc);

            //calculates amount of cones placed
            let tele_coral = (tele_l4 + tele_l3 + tele_l2 + tele_l1);
            this.percentileObject[i].push(tele_coral);

            //calculates amount of cubes placed
            let tele_algae = ( tele_process + tele_net);
            this.percentileObject[i].push(tele_algae);

            //adds up climb and park points
            let endgame_climb = this.percentileObject[i][this.percentileObject[0].indexOf("Climb")]
            let endgame_pts = endgame_climb;
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