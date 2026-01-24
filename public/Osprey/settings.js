let settings = {
  "imported":{
    "transitionMode": "auto"
  },
  "auto": [
    // Auto Actions
    {
      "label": "A Start Pos",
      "trigger": "s", 
      "columnStart": 1,
      "columnEnd": 2,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 0,
      "writeType": "cycG",
      "cycGOptions": ["left", "middle", "right"],
      "writeCycGOptions": 3
    },
    {
      "label": "A Depot",
      "trigger": "d", 
      "columnStart": 2,
      "columnEnd": 3,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 1,
      "writeType": "int"
    },
    {
      "label": "A Outpost",
      "trigger": "f", 
      "columnStart": 3,
      "columnEnd": 4,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 2,
      "writeType": "int"
    },
    {
      "label": "A NZ Pickup",
      "trigger": "g", 
      "columnStart": 4,
      "columnEnd": 5,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 3,
      "writeType": "int"
    },
    {
      "label": "A Dump",
      "trigger": "h", 
      "columnStart": 1,
      "columnEnd": 2,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 4,
      "writeType": "int"
    },
    {
      "label": "A Trench",
      "trigger": "j", 
      "columnStart": 2,
      "columnEnd": 3,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 5,
      "writeType": "int",
    },
    {
      "label": "A Shot",
      "trigger": "k", 
      "columnStart": 3,
      "columnEnd": 5,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 6,
      "writeType": "int"
    },
    {
      "label": "A Climb",
      "trigger": "l", 
      "columnStart": 1,
      "columnEnd": 3,
      "rowStart": 3,
      "rowEnd": 5,
      "writeLoc": 7,
      "writeType": "cycG",
      "cycGOptions": [0, 15],
      "writeCycGOptions": 2
    },
    {
      "label": "Auto Feed",
      "trigger": "z", 
      "columnStart": 3,
      "columnEnd": 5,
      "rowStart": 3,
      "rowEnd": 4,
      "writeLoc": 8,
      "writeType": "int",
    },
    {
      "label": "Auto Win",
      "trigger": "m", 
      "columnStart": 3,
      "columnEnd": 5,
      "rowStart": 4,
      "rowEnd": 5,
      "writeLoc": 9,
      "writeType": "bool",
    }
  ],





  "tele":[
    // simplify pickup?
    {
      "label": "T P Outpost",
      "trigger": "q", 
      "columnStart": 1,
      "columnEnd": 2,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 10,
      "writeType": "int"
    },
    {
      "label": "T P Own AZ",
      "trigger": "w", 
      "columnStart": 2,
      "columnEnd": 3,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 11,
      "writeType": "int"
    },
    {
      "label": "T P NZ",
      "trigger": "e", 
      "columnStart": 3,
      "columnEnd": 4,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 12,
      "writeType": "int"
    },
    {
      "label": "T P Opp AZ",
      "trigger": "r", 
      "columnStart": 4,
      "columnEnd": 5,
      "rowStart": 1,
      "rowEnd": 2,
      "writeLoc": 13,
      "writeType": "int"
    },
    {
      "label": "T Bump",
      "trigger": "t", 
      "columnStart": 1,
      "columnEnd": 2,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 14,
      "writeType": "int"
    },
    {
      "label": "T Trench",
      "trigger": "y", 
      "columnStart": 2,
      "columnEnd": 3,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 15,
      "writeType": "int"
    },
    {
      "label": "T Shot",
      "trigger": "u", 
      "columnStart": 3,
      "columnEnd": 5,
      "rowStart": 2,
      "rowEnd": 3,
      "writeLoc": 16,
      "writeType": "int"
    },
    {
      "label": "Defense",
      "trigger": "d", 
      "columnStart": 1,
      "columnEnd": 3,
      "rowStart": 3,
      "rowEnd": 4,
      "writeLoc": 17, 
      "writeType": "inc"
    },
    {
      "label": "Climb",
      "trigger": "c", 
      "columnStart": 1,
      "columnEnd": 2,
      "rowStart": 4,
      "rowEnd": 5,
      "writeLoc": 18,
      "writeType": "cycG",
      "cycGOptions": [0, 10, 20, 30],
      "writeCycGOptions": 4
    },
    {
      "label": "Same Rung",
      "trigger": "b", 
      "columnStart": 2,
      "columnEnd": 3,
      "rowStart": 4,
      "rowEnd": 5,
      "writeLoc": 19,
      "writeType": "bool",
    },
    {
      "label": "T F NZ",
      "trigger": "p", 
      "columnStart": 3,
      "columnEnd": 4,
      "rowStart": 3,
      "rowEnd": 4,
      "writeLoc": 20,
      "writeType": "int",
      
    },
    {
      "label": "T F Opp AZ",
      "trigger": "a", 
      "columnStart": 4,
      "columnEnd": 5,
      "rowStart": 3,
      "rowEnd": 4,
      "writeLoc": 21,
      "writeType": "int",
      
    },
    {
      "label": "Oof Time",
      "trigger": "s", 
      "columnStart": 3,
      "columnEnd": 5,
      "rowStart": 4,
      "rowEnd": 5,
      "writeLoc": 22,
      "writeType": "inc"
    }
  ], 

  "after":[
    // {
    //   "label":"Climbed?",
    //   "writeLoc": 16,
    //   "writeType": "cyc",
    //   "cycOptions": [0, 6, 10],
    //   "writeCycOptions": 3
    // },

    {
      "label": "Estimate Auto Balls Scored",
      "writeLoc": 23,
      "writeType": "int",
      "placeholder": "rough estimate"
    },
    {
      "label": "Estimate Tele Balls Scored", 
      "writeLoc": 24, 
      "writeType": "int",
      "placeholder": "rough estimate"
    },
    {
      "label": "Comments",
      "writeLoc": 25,
      "writeType": "str",
      "placeholder": "e.g. bad data"
    }
  ],
  "start": [
    {
      "label": "Scout ID",
      "writeLoc": 26,
      "writeType": "strBegin",
      "placeholder": "your lunch number"
    },
    {
      "label": "Team Number",
      "writeLoc": 27,
      "writeType": "strBegin",
      "placeholder": "# of the team you are scouting"
    },
    {
      "label": "Match Number",
      "writeLoc": 28,
      "writeType": "strBegin",
      "placeholder": "current match #"
    },
    {
      "label": "Team Position",
      "writeLoc": 29,
      "writeType": "strBegin",
      "placeholder": "1, 2, or 3"
    }
  ]
  
}

let dataValues = ["middle",0,0,0,0,0,0,0,0,false,0,0,0,0,0,0,0,0,0,false,0,0,0,0,0,""];
let dataLabels = [ "Starting Position", "Auto Depot Pickup", "Auto Outpost Pickup", "Auto NZ Pickup", "Auto Dump", "Auto Trench", "Auto Shot", "Auto Climb", "Auto Feed", "Auto Win", "Tele Outpost Pickup",  "Tele Pickup Own AZ", "Tele Pickup NZ", "Tele Pickup Opp AZ", "Tele Bump", "Tele Trench", "Tele Shot", "Tele Defense", "Tele Climb", "Tele Feed NZ", "Tele Feed Opp AZ", "Oof Time", "Estimate Auto", "Estimate Tele", "Comment"];

// let tempFix = [{
//   "label": "Attempted Climb",
//   "writeLoc": 7,
//   "writeType": "bool"
// }]

let themes = {
  "mainStyleSheet": ["#000", "#999999", "#fff", "#f3f3f3", "#E54C38", "invert(0%) sepia(100%) saturate(7430%) hue-rotate(46deg) brightness(81%) contrast(114% opacity(50%))"],
// main, second, bg, highlight, 
"styleCarbon" : ["#eee", "#444", "#111", "#191919", "#da3333", "invert(100%) sepia(0%) saturate(6935%) hue-rotate(270deg) brightness(111%) contrast(87%) opacity(50%)"],
"styleMilkshake" : ["#000", "#999999", "#fff", "#f3f3f3", "#ffd1dc", "invert(0%) sepia(100%) saturate(7430%) hue-rotate(46deg) brightness(81%) contrast(114% opacity(50%))"],
"styleIceberg" : ["#212b43", "#62cfe6", "#f3fdff", "#ddeff3", "#e58c9d", "invert(16%) sepia(9%) saturate(2627%) hue-rotate(185deg) brightness(95%) contrast(96%) opacity(50%)"],
"styleLavender" : ["#54338e", "#9375c7", "#c4b2e3", "#e3daf2", "#e3daf2", "invert(11%) sepia(32%) saturate(6816%) hue-rotate(238deg) brightness(97%) contrast(99%) opacity(50%)"],
"styleHightide" : ["#094a58", "#00b6ae", "#fff", "#c1c1c1", "#3b3b3b", "invert(22%) sepia(51%) saturate(742%) hue-rotate(143deg) brightness(94%) contrast(96%) opacity(50%)"],
"styleEvergreen" : ["#edf5e1", "#05386b", "#5cdb95", "#8ee4af", "#379683", "invert(96%) sepia(9%) saturate(491%) hue-rotate(43deg) brightness(106%) contrast(92%) opacity(50%)"],
"styleOlivia" : ["#f2efed", "#deaf9d", "#1c1b1d", "#4e3e3e", "#bf616a", "invert(97%) sepia(47%) saturate(304%) hue-rotate(292deg) brightness(104%) contrast(90%) opacity(50%)"],
"style2077" : ["#e8e8e8", "#feff04", "#212121", "rgba(92,74,156,0.5)", "#da3333", "invert(100%) sepia(2%) saturate(421%) hue-rotate(168deg) brightness(115%) contrast(82%) opacity(50%)"],
"styleAlpine" : ["#d8dee9", "#617b94", "#242933", "#1b1f27", "#bf616a", "invert(92%) sepia(7%) saturate(277%) hue-rotate(180deg) brightness(97%) contrast(92%) opacity(50%)"],
"styleShadow" : ["#383e42", "#5e676e", "#010203", "#121212", "#e25303", "invert(22%) sepia(16%) saturate(303%) hue-rotate(161deg) brightness(95%) contrast(91%) opacity(50%)"]
}