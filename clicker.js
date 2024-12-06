
let garfs = document.getElementById("garfs");
let GARFS = Number(localStorage['GARFS'] || 0);

// building stats [amount owned, cost, GPS]
let lasagnas = [(Number(localStorage['lasagnas[0]'] || 0))];
lasagnas[1] = (Math.trunc(((1.3**lasagnas[0]) * 10)));
lasagnas[2] = (0.1);

let monsters = [(Number(localStorage['monsters[0]'] || 0))];
monsters[1] = (Math.trunc(((1.3**monsters[0]) * 200)));
monsters[2] = (1)

let anteaters = [(Number(localStorage['anteaters[0]'] || 0))];
anteaters[1] = (Math.trunc(((1.3**anteaters[0]) * 15000)));
anteaters[2] = (10)

let unlockedBuildings = [];
function updateOwnedBuildings() {
    if (lasagnas[0] > 0) {
        if (unlockedBuildings.includes('lasagnas') == false) {
            unlockedBuildings.push('lasagnas');
        };
    };
    if (monsters[0] > 0) {
        if (unlockedBuildings.includes('monsters') == false) {
            unlockedBuildings.push('monsters');
        };
    };
    if (anteaters[0] > 0) {
        if (unlockedBuildings.includes('anteaters') == false) {
            unlockedBuildings.push('anteaters');
        };
    };
};
updateOwnedBuildings()

let clickAmount = [1]
let gpsMultiplier = [1];

let goldNermalStats = [(0.9*1/60), 60, 5] 
let goldNermalBuffs = ['Double GPS', '10x Click Power', 'Free Random Building']
// [chance of spawn per second, duration seconds, time before disapearing]
// 50% chance of golden nermal every 30 minutes (0.5(chance)/30(minutes)/60)
// let goldNermalSpawnInterval = [setInterval(spawnNermal, 1000)];

garfs.innerHTML = GARFS;
document.getElementById("title").innerHTML = (GARFS + " Garfs")
let garface = document.getElementById("garface");
let previousGarfs = Number(GARFS);
let costLasagnas;
let costMonsters;
let storeOpen = false;
let absoluteGPS = ((lasagnas[2] * lasagnas[0]) + 
                   (monsters[2] * monsters[0]) +   
                   (anteaters[0] * anteaters[2]));
let ticInterval = [];

if (lasagnas[0] > 0) {
    ticInterval[0] = setInterval(Tic, 1000/absoluteGPS);
};
if (lasagnas[0] >= 10) {
    document.getElementById("monsters").style.display = "block";
};
if (monsters[0] >= 15) {
    document.getElementById("anteaters").style.display = "block";
};

function expand() {
    garface.style = "width: 450px";
};
function shrink() {
    garface.style = "padding-bottom: 50px; padding-top: 25px";
};
function click() {
    previousGarfs = GARFS;
    GARFS = (previousGarfs + clickAmount[0]);
    garfs.innerHTML = GARFS;
    document.getElementById("title").innerHTML = (GARFS + " Garfs");
};
function save() {
    localStorage['GARFS'] = String(GARFS);
    localStorage['lasagnas[0]'] = String(lasagnas[0]);
    localStorage['monsters[0]'] = String(monsters[0]);
    localStorage['anteaters[0]'] = String(anteaters[0]);
};
function RefreshInterval() {
    clearInterval(ticInterval[0]);
    ticInterval[0] = setInterval(Tic, ((1000/gpsMultiplier[0])/parseFloat(absoluteGPS)));
    updateOwnedBuildings()
};
function toggleStore() {
    if (storeOpen == false) {
        document.getElementById("STORE").style.display = "block"
        if (lasagnas[0] >= 10) {
            document.getElementById("monsters").style.display = ""
            document.getElementById("buyMonsters").onclick = function() {buyMonsters()};
            document.getElementById("numMonsters").innerHTML = monsters[0]
            document.getElementById("costMonsters").innerHTML = monsters[1]
            document.getElementById("gpsMonsters").innerHTML = monsters[2]
            if (monsters[0] >= 15) {
                document.getElementById("anteaters").style.display = ""
                document.getElementById("buyAnteaters").onclick = function() {buyAnteaters()};
                document.getElementById("numAnteaters").innerHTML = anteaters[0]
                document.getElementById("costAnteaters").innerHTML = anteaters[1]
                document.getElementById("gpsAnteaters").innerHTML = anteaters[2]
            };
        };
        document.getElementById("STOREBUTTON").innerHTML = "STORE ▲";
        document.getElementById("numLasagnas").innerHTML = lasagnas[0];
        document.getElementById("costLasagnas").innerHTML = lasagnas[1];
        document.getElementById("gpsLasagnas").innerHTML = lasagnas[2];
        document.getElementById("buyLasagnas").onclick = function() {buyLasagna()};
        storeOpen = true;
    } else {
        document.getElementById("STOREBUTTON").innerHTML = "STORE ▼";
        document.getElementById("STORE").style.display = "none";
        storeOpen = false;
    };
};
function buyMonsters() {
    
    if (GARFS >= monsters[1]) {
        previousGarfs = GARFS;
        GARFS = (previousGarfs - monsters[1]);
        garfs.innerHTML = GARFS;

        monsters[0] = monsters[0] + 1;
        absoluteGPS = ((lasagnas[0]*lasagnas[2]) + (monsters[2]*monsters[0]));
        document.getElementById("GPS").innerHTML = "GPS: " + absoluteGPS.toFixed(1);
        monsters[1] = Math.trunc(((1.3**monsters[0]) * 200));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        window.alert("Not enough Garfs :(");
    };
};

function buyAnteaters() {
    
    if (GARFS >= anteaters[1]) {
        previousGarfs = GARFS;
        GARFS = (previousGarfs - anteaters[1]);
        garfs.innerHTML = GARFS;

        anteaters[0] = anteaters[0] + 1;
        absoluteGPS = ((lasagnas[0]*lasagnas[2]) +
                       (monsters[2]*monsters[0]) + 
                       (anteaters[0]*anteaters[2]));
        document.getElementById("GPS").innerHTML = "GPS: " + absoluteGPS.toFixed(1);
        anteaters[1] = Math.trunc(((1.3**anteaters[0]) * 15000));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        window.alert("Not enough Garfs :(");
    };
};

function buyLasagna() {
    if (GARFS >= lasagnas[1]) {
        previousGarfs = Number(`${GARFS}`);
        GARFS = (previousGarfs - lasagnas[1]);
        garfs.innerHTML = GARFS;
        lasagnas[0] = lasagnas[0] + 1;
        absoluteGPS = ((lasagnas[0]*lasagnas[2]) + (monsters[0] * monsters[2]));
        document.getElementById("GPS").innerHTML = "GPS: " + absoluteGPS.toFixed(1); 
        lasagnas[1] = Math.trunc(((1.3**lasagnas[0]) * 10));
        storeOpen = false; 
        setTimeout(RefreshInterval(), 1); 
        toggleStore(); 
    } else {
        window.alert("Not enough Garfs :(");
    };
};
if (absoluteGPS > 0) {
    document.getElementById("GPS").innerHTML = "GPS: " + absoluteGPS.toFixed(1);
};
function Tic() {
    previousGarfs = GARFS;
    GARFS = (previousGarfs + 1);
    garfs.innerHTML = GARFS;    
    document.getElementById("title").innerHTML = (GARFS + " Garfs");    
};
function reset() {
    localStorage['GARFS'] = String(0);
    localStorage['lasagnas[0]'] = String(0);
    localStorage['monsters[0]'] = String(0);
    location.reload();
};

/*
function spawnNermal(override) {
    var nermalClicked = false;
    let randomNumber = Math.random();
    if (randomNumber < goldNermalStats[0] || override) {
        document.getElementById('goldenNermal').style.display = 'block';
        document.getElementById('goldenNermal').style.left = `${(Math.random() * window.innerWidth)}px`;
        document.getElementById('goldenNermal').style.top = `${(Math.random() * window.innerHeight)}px`;
        console.log(`window height: ${window.innerHeight}`)
        console.log(`window width: ${window.innerWidth}`)
        console.log(`nermal height: ${document.getElementById('goldenNermal').style.top}`)
        console.log(`nermal width: ${document.getElementById('goldenNermal').style.left}`)
        document.getElementById('goldenNermal').addEventListener('click', function() {
            nermalClicked = true;
            document.getElementById('goldenNermal').style.display = 'none';
            let randBuff = goldNermalBuffs[Math.floor(Math.random() * goldNermalBuffs.length)];
            if (randBuff == 'Double GPS') {
                let tempGpsMultiply = gpsMultiplier[0]/2;
                gpsMultiplier[0] = tempGpsMultiply;
                RefreshInterval()
                let xTimer = goldNermalStats[1];
                document.getElementById('goldenNermalMessage').style.display = 'block';
                document.getElementById('buffName').innerHTML = "Double GPS";
                let effectDuration = setInterval(function() {
                    document.getElementById('buffTime').innerHTML = xTimer;
                    xTimer -= 1;
                    if (xTimer == 0) {
                        clearXTimer()
                    }
                }, 1000);
                function clearXTimer() {
                    clearInterval(effectDuration);
                    document.getElementById('goldenNermalMessage').style.display = 'block';
                    gpsMultiplier[0] = tempGpsMultiply*2
                };
            } else if (randBuff == '10x Click Power') {
                let tempClickMultiply = clickAmount[0]*10;
                clickAmount[0] = tempClickMultiply;
                let xTimer = goldNermalStats[1];
                document.getElementById('goldenNermalMessage').style.display = 'block';
                document.getElementById('buffName').innerHTML = "10x Click Power";
                let effectDuration = setInterval(function() {
                    document.getElementById('buffTime').innerHTML = xTimer;
                    xTimer -= 1;
                    if (xTimer == 0) {
                        clearXTimer();   
                    };
                }, 1000)
                function clearXTimer() {
                    clearInterval(effectDuration);
                    document.getElementById('goldenNermalMessage').style.display = 'block';
                    clickAmount[0] = tempGpsMultiply/10
                };
            } else if (randBuff == 'Free Random Building') {
                let randBuildingIndex = Math.floor(Math.random()*unlockedBuildings.length)
                if (unlockedBuildings[randBuildingIndex] == 'lasagnas') {
                    previousGarfs = GARFS;
                    GARFS = (previousGarfs + lasagnas[1]);
                    buyLasagna()
                } else if (unlockedBuildings[randBuildingIndex] == 'monsters') {
                    previousGarfs = GARFS;
                    GARFS = (previousGarfs + monsters[1]);
                    buyMonsters()
                } else if (unlockedBuildings[randBuildingIndex] == 'anteaters') {
                    previousGarfs = GARFS;
                    GARFS = (previousGarfs + anteaters[1]);
                    buyAnteaters()
                };
                document.getElementById('goldenNermalMessage').style.display = 'block';
                document.getElementById('buffName').innerHTML = "Free Random Building";
                document.getElementById('buffTime').innerHTML = '';
                let effectDuration = setTimeout(function() {
                    document.getElementById('goldenNermalMessage').style.display = 'none';
                    document.getElementById('buffTime').innerHTML = '00';
                }, 1000);
            }
        })
        setTimeout(function() {
            if (nermalClicked == false) {
                document.getElementById('goldenNermal').style.display = 'none';
            }
        }, goldNermalStats[2]*1000);
    }
}
*/

garface.onmouseenter = function() {expand()};
garface.onmouseleave = function() {shrink()};
garface.onclick = function() {click()};
document.getElementById("SAVE").onclick = function() {save()};
document.getElementById("STOREBUTTON").onclick = function() {toggleStore()};
document.getElementById("RESET").onclick = function() {reset()};

let mouseOver = [];
let previousMouseOver = [];
let mouseOverListChangeParameters = [];
let arrayRemoveParam = [];
function mouseOverListChange() {
    building = mouseOverListChangeParameters[0];
    infoBuilding = mouseOverListChangeParameters[1];
    infoBuildingElement = mouseOverListChangeParameters[2];
    if (mouseOver != previousMouseOver) {
        if ((mouseOver.includes(building) != false) || (mouseOver.includes(infoBuilding) != false)){
            if (document.getElementById(infoBuildingElement).className == "buildingInfoHidden") {
                document.getElementById('center_column').style.paddingBottom = '5%';
                document.getElementById(infoBuildingElement).className = "buildingInfoVisible";
                document.getElementById(infoBuildingElement).classList.replace("buildingInfoHidden", "buildingInfoVisible");
            };
        } else {
            document.getElementById('center_column').style.paddingBottom = '15%';
            document.getElementById(infoBuildingElement).className = "buildingInfoHidden";
            document.getElementById(infoBuildingElement).classList.replace("buildingInfoVisible", "buildingInfoHidden");
        };
        
        previousMouseOver = [];
        for (x=0; x<mouseOver.length; x++) {
            previousMouseOver.push(mouseOver[x]);
        };
    };
};

function arrayRemove() {
    let array = arrayRemoveParam[0];
    let stringRemoved = arrayRemoveParam[1];
    let newArray = [];
    for (i=0; i<array.length; i++) {
        if (array[i] != stringRemoved) {
            newArray.push(array[i]);
        } else {
            continue;
        };
    };
    return(newArray);
};

mouseOver = [];
let addBuildingParam = [];
function addBuilding() {
    let building = addBuildingParam[0];
    let infoBuilding = addBuildingParam[1];
    let infoBuildingElement = addBuildingParam[2];
    if (mouseOver.includes(building) != true) {
            mouseOver.push(building);
            mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
            mouseOverListChange();
        };
};

let remBuildingInfoParam = []
function remBuildingInfo() {
    let building = remBuildingInfoParam[0];
    let infoBuilding = remBuildingInfoParam[1];
    let infoBuildingElement = remBuildingInfoParam[2];
    let addBuildingInfoParam = [];
    function addBuildingInfo() {
        let building = addBuildingInfoParam[0];
        let infoBuilding = addBuildingInfoParam[1];
        let infoBuildingElement = addBuildingInfoParam[2];
        if (mouseOver.includes(infoBuilding) != true) {
                    mouseOver.push(infoBuilding);
                    mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
                    mouseOverListChange();
                };
    };
    addBuildingInfoParam = [building, infoBuilding, infoBuildingElement];
    document.getElementById(infoBuildingElement).addEventListener('mouseover', addBuildingInfo);
    let remBuildingInfoParam = []
    function remBuildingInfo() {
        let building = remBuildingInfoParam[0];
        let infoBuilding = remBuildingInfoParam[1];
        let infoBuildingElement = remBuildingInfoParam[2];
        if (mouseOver.includes(infoBuilding)) {
            arrayRemoveParam = [building, infoBuilding, infoBuildingElement]
            mouseOver = arrayRemove();
            mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
            mouseOverListChange();
        };
    }
    remBuildingInfoParam = [building, infoBuilding, infoBuildingElement];
    document.getElementById(infoBuildingElement).addEventListener('mouseout', remBuildingInfo);

    if (mouseOver.includes(building)) {
        arrayRemoveParam = [building, infoBuilding, infoBuildingElement];
        mouseOver = arrayRemove();
        mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
        mouseOverListChange();
    };
};

let remBuildingParam = []
function remBuilding() {
    let building = remBuildingParam[0];
    let infoBuilding = remBuildingParam[1];
    let infoBuildingElement = remBuildingParam[2];

    addBuildingInfoParam = []
    function addBuildingInfo() {
        let building = addBuildingInfoParam[0];
        let infoBuilding = addBuildingInfoParam[1];
        let infoBuildingElement = addBuildingInfoParam[2];
        if (mouseOver.includes(infoBuilding) != true) {
            mouseOver.push(infoBuilding);
            mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
            mouseOverListChange();
        };
    };
    remBuildingInfoParam = [building, infoBuilding, infoBuildingElement]
    function remBuildingInfo() {
        let building = remBuildingInfoParam[0];
        let infoBuilding = remBuildingInfoParam[1];
        let infoBuildingElement = remBuildingInfoParam[2];
        if (mouseOver.includes(infoBuilding)) {
            arrayRemoveParam = [mouseOver, infoBuilding];
            mouseOver = arrayRemove();
            mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
            mouseOverListChange();
        };
    };
    addBuildingInfoParam = [building, infoBuilding, infoBuildingElement]
    document.getElementById(infoBuildingElement).addEventListener('mouseover', addBuildingInfo);
    remBuildingInfoParam = [building, infoBuilding, infoBuildingElement]
    document.getElementById(infoBuildingElement).addEventListener('mouseout', remBuildingInfo);
    if (mouseOver.includes(building)) {
        arrayRemoveParam = [mouseOver, building];
        mouseOver = arrayRemove();
        mouseOverListChangeParameters = [building, infoBuilding, infoBuildingElement];
        mouseOverListChange();
    };
};

document.getElementById("buyLasagnas").addEventListener('mouseover', function() {
    addBuildingParam = ["lasagnas", "infoLasagna", "infoLasagnas"];
    remBuildingParam = ["lasagnas", "infoLasagna", "infoLasagnas"];
    addBuilding();
    document.getElementById("buyLasagnas").addEventListener('mouseout', remBuilding);
});

document.getElementById("buyMonsters").addEventListener('mouseover', function() {
    addBuildingParam = ["monsters", "infoMonster", "infoMonsters"];
    remBuildingParam = ["monsters", "infoMonster", "infoMonsters"];
    addBuilding();
    document.getElementById("buyMonsters").addEventListener('mouseout', remBuilding);
});

document.getElementById("buyAnteaters").addEventListener('mouseover', function() {
    addBuildingParam = ["anteaters", "infoAnteater", "infoAnteaters"];
    remBuildingParam = ["anteaters", "infoAnteater", "infoAnteaters"];
    addBuilding();
    document.getElementById("buyAnteaters").addEventListener('mouseout', remBuilding);
});
