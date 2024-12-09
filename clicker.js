let THEME = (localStorage['THEME'] || 'McCuen')
let cuenCoins = document.getElementById("cuenCoins");
let CUENCOINS = Number(localStorage['CUENCOINS'] || 0);

// building stats [amount owned, cost, CCPS]
let mechs = [(Number(localStorage['mechs[0]'] || 0))];
mechs[1] = (Math.trunc(((1.3**mechs[0]) * 10)));
mechs[2] = (0.1);

let teams = [(Number(localStorage['teams[0]'] || 0))];
teams[1] = (Math.trunc(((1.3**teams[0]) * 200)));
teams[2] = (1)

let anteaters = [(Number(localStorage['anteaters[0]'] || 0))];
anteaters[1] = (Math.trunc(((1.3**anteaters[0]) * 15000)));
anteaters[2] = (10)

let unlockedBuildings = [];
function updateOwnedBuildings() {
    if (mechs[0] > 0) {
        if (unlockedBuildings.includes('mechs') == false) {
            unlockedBuildings.push('mechs');
        };
    };
    if (teams[0] > 0) {
        if (unlockedBuildings.includes('teams') == false) {
            unlockedBuildings.push('teams');
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
let ccpsMultiplier = [1];

let goldDuckStats = [(0.9*1/60), 60, 5] 
let goldDuckBuffs = ['Double CCPS', '10x Click Power', 'Free Random Building']
// [chance of spawn per second, duration seconds, time before disapearing]
// 50% chance of golden duck every 30 minutes (0.5(chance)/30(minutes)/60)
// let goldDuckSpawnInterval = [setInterval(spawnDuck, 1000)];

cuenCoins.innerHTML = CUENCOINS;
document.getElementById("title").innerHTML = (CUENCOINS + " CuenCoins")
let McCuenFace = document.getElementById("McCuenFace");
let previousCuenCoins = Number(CUENCOINS);
let costMechs;
let costTeams;
let storeOpen = false;
let absoluteCCPS = ((mechs[2] * mechs[0]) + 
                   (teams[2] * teams[0]) +   
                   (anteaters[0] * anteaters[2]));
let ticInterval = [];

if (mechs[0] > 0) {
    ticInterval[0] = setInterval(Tic, 1000/absoluteCCPS);
};
if (mechs[0] >= 10) {
    document.getElementById("teams").style.display = "block";
};
if (teams[0] >= 15) {
    document.getElementById("anteaters").style.display = "block";
};

function expand() {
    McCuenFace.style = "width: 450px";
};
function shrink() {
    McCuenFace.style = "padding-bottom: 50px; padding-top: 25px";
};
function click() {
    previousCuenCoins = CUENCOINS;
    CUENCOINS = (previousCuenCoins + clickAmount[0]);
    cuenCoins.innerHTML = CUENCOINS;
    document.getElementById("title").innerHTML = (CUENCOINS + " CuenCoins");
};
function save() {
    localStorage['CUENCOINS'] = String(CUENCOINS);
    localStorage['mechs[0]'] = String(mechs[0]);
    localStorage['teams[0]'] = String(teams[0]);
    localStorage['anteaters[0]'] = String(anteaters[0]);
};
function RefreshInterval() {
    clearInterval(ticInterval[0]);
    ticInterval[0] = setInterval(Tic, ((1000/ccpsMultiplier[0])/parseFloat(absoluteCCPS)));
    updateOwnedBuildings()
};
function toggleStore() {
    if (storeOpen == false) {
        document.getElementById("STORE").style.display = "block"
        if (mechs[0] >= 10) {
            document.getElementById("teams").style.display = ""
            document.getElementById("buyTeams").onclick = function() {buyTeams()};
            document.getElementById("numTeams").innerHTML = teams[0]
            document.getElementById("costTeams").innerHTML = teams[1]
            document.getElementById("ccpsTeams").innerHTML = teams[2]
            if (teams[0] >= 15) {
                document.getElementById("anteaters").style.display = ""
                document.getElementById("buyAnteaters").onclick = function() {buyAnteaters()};
                document.getElementById("numAnteaters").innerHTML = anteaters[0]
                document.getElementById("costAnteaters").innerHTML = anteaters[1]
                document.getElementById("ccpsAnteaters").innerHTML = anteaters[2]
            };
        };
        document.getElementById("STOREBUTTON").innerHTML = "STORE ▲";
        document.getElementById("numMechs").innerHTML = mechs[0];
        document.getElementById("costMechs").innerHTML = mechs[1];
        document.getElementById("ccpsMechs").innerHTML = mechs[2];
        document.getElementById("buyMechs").onclick = function() {buyMech()};
        storeOpen = true;
    } else {
        document.getElementById("STOREBUTTON").innerHTML = "STORE ▼";
        document.getElementById("STORE").style.display = "none";
        storeOpen = false;
    };
};
function buyTeams() {
    
    if (CUENCOINS >= teams[1]) {
        previousCuenCoins = CUENCOINS;
        CUENCOINS = (previousCuenCoins - teams[1]);
        cuenCoins.innerHTML = CUENCOINS;

        teams[0] = teams[0] + 1;
        absoluteCCPS = ((mechs[0]*mechs[2]) + (teams[2]*teams[0]));
        document.getElementById("CCPS").innerHTML = "CCPS: " + absoluteCCPS.toFixed(1);
        teams[1] = Math.trunc(((1.3**teams[0]) * 200));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        window.alert("Not enough CuenCoins :(");
    };
};

function buyAnteaters() {
    
    if (CUENCOINS >= anteaters[1]) {
        previousCuenCoins = CUENCOINS;
        CUENCOINS = (previousCuenCoins - anteaters[1]);
        cuenCoins.innerHTML = CUENCOINS;

        anteaters[0] = anteaters[0] + 1;
        absoluteCCPS = ((mechs[0]*mechs[2]) +
                       (teams[2]*teams[0]) + 
                       (anteaters[0]*anteaters[2]));
        document.getElementById("CCPS").innerHTML = "CCPS: " + absoluteCCPS.toFixed(1);
        anteaters[1] = Math.trunc(((1.3**anteaters[0]) * 15000));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        window.alert("Not enough CuenCoins :(");
    };
};

function buyMech() {
    if (CUENCOINS >= mechs[1]) {
        previousCuenCoins = Number(`${CUENCOINS}`);
        CUENCOINS = (previousCuenCoins - mechs[1]);
        cuenCoins.innerHTML = CUENCOINS;
        mechs[0] = mechs[0] + 1;
        absoluteCCPS = ((mechs[0]*mechs[2]) + (teams[0] * teams[2]));
        document.getElementById("CCPS").innerHTML = "CCPS: " + absoluteCCPS.toFixed(1); 
        mechs[1] = Math.trunc(((1.3**mechs[0]) * 10));
        storeOpen = false; 
        setTimeout(RefreshInterval(), 1); 
        toggleStore(); 
    } else {
        window.alert("Not enough CuenCoins :(");
    };
};
if (absoluteCCPS > 0) {
    document.getElementById("CCPS").innerHTML = "CCPS: " + absoluteCCPS.toFixed(1);
};
function Tic() {
    previousCuenCoins = CUENCOINS;
    CUENCOINS = (previousCuenCoins + 1);
    cuenCoins.innerHTML = CUENCOINS;    
    document.getElementById("title").innerHTML = (CUENCOINS + " CuenCoins");    
};
function reset() {
    localStorage['CUENCOINS'] = String(0);
    localStorage['mechs[0]'] = String(0);
    localStorage['teams[0]'] = String(0);
    location.reload();
};


function spawnDuck(override) {
    var duckClicked = false;
    let randomNumber = Math.random();
    if (randomNumber < goldDuckStats[0] || override) {
        document.getElementById('goldenDuck').style.display = 'block';
        document.getElementById('goldenDuck').style.left = `${((Math.random() * 0.8) * window.innerWidth)}px`;
        document.getElementById('goldenDuck').style.top = `${((0.7*Math.random()) * window.innerHeight)}px`;
        console.log(`window height: ${window.innerHeight}`)
        console.log(`window width: ${window.innerWidth}`)
        console.log(`duck height: ${document.getElementById('goldenDuck').style.top}`)
        console.log(`duck width: ${document.getElementById('goldenDuck').style.left}`)
        document.getElementById('goldenDuck').addEventListener('click', function() {
            duckClicked = true;
            document.getElementById('goldenDuck').style.display = 'none';
            let randBuff = goldDuckBuffs[Math.floor(Math.random() * goldDuckBuffs.length)];
            if (randBuff == 'Double CCPS') {
                let tempCcpsMultiply = ccpsMultiplier[0]/2;
                ccpsMultiplier[0] = tempCcpsMultiply;
                RefreshInterval()
                let xTimer = goldDuckStats[1];
                document.getElementById('goldenDuckMessage').style.display = 'block';
                document.getElementById('buffName').innerHTML = "Double CCPS";
                let effectDuration = setInterval(function() {
                    document.getElementById('buffTime').innerHTML = xTimer;
                    xTimer -= 1;
                    if (xTimer == 0) {
                        clearXTimer()
                    }
                }, 1000);
                function clearXTimer() {
                    clearInterval(effectDuration);
                    document.getElementById('goldenDuckMessage').style.display = 'block';
                    ccpsMultiplier[0] = tempCcpsMultiply*2
                };
            } else if (randBuff == '10x Click Power') {
                let tempClickMultiply = clickAmount[0]*10;
                clickAmount[0] = tempClickMultiply;
                let xTimer = goldDuckStats[1];
                document.getElementById('goldenDuckMessage').style.display = 'block';
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
                    document.getElementById('goldenDuckMessage').style.display = 'block';
                    clickAmount[0] = tempCcpsMultiply/10
                };
            } else if (randBuff == 'Free Random Building') {
                let randBuildingIndex = Math.floor(Math.random()*unlockedBuildings.length)
                if (unlockedBuildings[randBuildingIndex] == 'mechs') {
                    previousCuenCoins = CUENCOINS;
                    CUENCOINS = (previousCuenCoins + mechs[1]);
                    buyMech()
                } else if (unlockedBuildings[randBuildingIndex] == 'teams') {
                    previousCuenCoins = CUENCOINS;
                    CUENCOINS = (previousCuenCoins + teams[1]);
                    buyTeams()
                } else if (unlockedBuildings[randBuildingIndex] == 'anteaters') {
                    previousCuenCoins = CUENCOINS;
                    CUENCOINS = (previousCuenCoins + anteaters[1]);
                    buyAnteaters()
                };
                document.getElementById('goldenDuckMessage').style.display = 'block';
                document.getElementById('buffName').innerHTML = "Free Random Building";
                document.getElementById('buffTime').innerHTML = '';
                let effectDuration = setTimeout(function() {
                    document.getElementById('goldenDuckMessage').style.display = 'none';
                    document.getElementById('buffTime').innerHTML = '00';
                }, 1000);
            }
        })
        setTimeout(function() {
            if (duckClicked == false) {
                document.getElementById('goldenDuck').style.display = 'none';
            }
        }, goldDuckStats[2]*1000);
    }
}

document.addEventListener('keydown', function(key) {
    if (key.code == 'KeyQ') {
        spawnDuck(true)
    }
})

McCuenFace.onmouseenter = function() {expand()};
McCuenFace.onmouseleave = function() {shrink()};
McCuenFace.onclick = function() {click()};
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

document.getElementById("buyMechs").addEventListener('mouseover', function() {
    addBuildingParam = ["mechs", "infoMech", "infoMechs"];
    remBuildingParam = ["mechs", "infoMech", "infoMechs"];
    addBuilding();
    document.getElementById("buyMechs").addEventListener('mouseout', remBuilding);
});

document.getElementById("buyTeams").addEventListener('mouseover', function() {
    addBuildingParam = ["teams", "infoTeam", "infoTeams"];
    remBuildingParam = ["teams", "infoTeam", "infoTeams"];
    addBuilding();
    document.getElementById("buyTeams").addEventListener('mouseout', remBuilding);
});

document.getElementById("buyAnteaters").addEventListener('mouseover', function() {
    addBuildingParam = ["anteaters", "infoAnteater", "infoAnteaters"];
    remBuildingParam = ["anteaters", "infoAnteater", "infoAnteaters"];
    addBuilding();
    document.getElementById("buyAnteaters").addEventListener('mouseout', remBuilding);
});


var SETTINGSOPEN = [false];
var SETTINGTHEMESOPEN = [false];
document.getElementById('SETTINGSBUTTON').addEventListener('click', function() {
    if (SETTINGSOPEN[0] == false) {
        SETTINGSOPEN = [true];
        document.getElementById('SETTINGSMENU').style.display = 'block';
    } else {
        document.getElementById('SETTINGSMENU').style.display = 'none';
        document.getElementById('infoTHEMES').style.display = 'none';
        SETTINGTHEMESOPEN = [false];
        SETTINGSOPEN = [false];
    }
})

document.getElementById('THEMES').addEventListener('click', function() {
            if (SETTINGTHEMESOPEN[0] == false) {
                document.getElementById('infoTHEMES').style.display = 'block';
                SETTINGTHEMESOPEN = [true];
            } else {
                SETTINGTHEMESOPEN = [false];
                document.getElementById('infoTHEMES').style.display = 'none';
            }
        });
