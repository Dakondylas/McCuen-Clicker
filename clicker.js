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

let cats = [(Number(localStorage['cats[0]'] || 0))];
cats[1] = (Math.trunc(((1.3**cats[0]) * 15000)));
cats[2] = (10)
let GarfieldTextWords = ['GPS', 'Gps', 'gps', 'Garfs', 'Garfield']
let McCuenTextWords = ['CCPS', 'Ccps', 'ccps', 'CuenCoins', 'McCuen']
let usedTheme = [McCuenTextWords];

window.addEventListener('load', function() {
    document.getElementById('STOREBUTTON').click()
    expand()
    setTimeout(function() {
        shrink()
        document.getElementById('STOREBUTTON').click()
    }, 1)
})

function updateAbsoluteCCPS() {
    return (((mechs[0]*mechs[2]) + 
            (teams[0]*teams[2]) + 
            (cats[0]*cats[2]))*ccpsMultiplier[0])
};

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
    if (cats[0] > 0) {
        if (unlockedBuildings.includes('cats') == false) {
            unlockedBuildings.push('cats');
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
let goldDuckSpawnInterval = [setInterval(spawnDuck(), 1000)];

cuenCoins.innerHTML = CUENCOINS;
document.getElementById("title").innerHTML = (CUENCOINS + ` ${usedTheme[0][0]}`)
let McCuenFace = document.getElementById("McCuenFace");
let previousCuenCoins = Number(CUENCOINS);
let costMechs;
let costTeams;
let storeOpen = false;
let absoluteCCPS = updateAbsoluteCCPS()
let ticInterval = [];

if (mechs[0] > 0) {
    ticInterval[0] = setInterval(Tic, 1000/absoluteCCPS);
};
if (mechs[0] >= 10) {
    document.getElementById("teams").style.display = "block";
};
if (teams[0] >= 15) {
    document.getElementById("cats").style.display = "block";
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
    document.getElementById("title").innerHTML = (CUENCOINS + ` ${usedTheme[0][0]}`);
};
function save() {
    localStorage['CUENCOINS'] = String(CUENCOINS);
    localStorage['mechs[0]'] = String(mechs[0]);
    localStorage['teams[0]'] = String(teams[0]);
    localStorage['cats[0]'] = String(cats[0]);
};
function RefreshInterval() {
    clearInterval(ticInterval[0]);
    absoluteCCPS = updateAbsoluteCCPS()
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
                document.getElementById("cats").style.display = ""
                document.getElementById("buyCats").onclick = function() {buyCats()};
                document.getElementById("numCats").innerHTML = cats[0]
                document.getElementById("costCats").innerHTML = cats[1]
                document.getElementById("ccpsCats").innerHTML = cats[2]
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
        RefreshInterval()
        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]} ` + absoluteCCPS.toFixed(1);
        teams[1] = Math.trunc(((1.3**teams[0]) * 200));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        if (!document.getElementById('notEnoughCuenCoinsMessage')) {
            const message = document.createElement('div');
            message.id = 'notEnoughCuenCoinsMessage';
            message.style.position = 'fixed';
            message.style.top = '10%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, 0)';
            message.style.backgroundColor = '#ffcccc';
            message.style.padding = '10px 20px';
            message.style.border = '2px solid #ff6666';
            message.style.borderRadius = '5px';
            message.style.color = '#990000';
            message.style.fontSize = '16px';
            message.style.fontWeight = 'bold';
            message.style.zIndex = '1000';
            message.innerText = `Not Enough ${usedTheme[3]}`;
            document.body.appendChild(message);
       
            // Automatically remove the message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        }
    };
};

function buyCats() {
    
    if (CUENCOINS >= cats[1]) {
        previousCuenCoins = CUENCOINS;
        CUENCOINS = (previousCuenCoins - cats[1]);
        cuenCoins.innerHTML = CUENCOINS;

        cats[0] = cats[0] + 1;
        RefreshInterval()
        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
        cats[1] = Math.trunc(((1.3**cats[0]) * 15000));
        storeOpen = false;
        setTimeout(RefreshInterval(), 1);
        
        toggleStore();
    } else {
        if (!document.getElementById('notEnoughCuenCoinsMessage')) {
            const message = document.createElement('div');
            message.id = 'notEnoughCuenCoinsMessage';
            message.style.position = 'fixed';
            message.style.top = '10%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, 0)';
            message.style.backgroundColor = '#ffcccc';
            message.style.padding = '10px 20px';
            message.style.border = '2px solid #ff6666';
            message.style.borderRadius = '5px';
            message.style.color = '#990000';
            message.style.fontSize = '16px';
            message.style.fontWeight = 'bold';
            message.style.zIndex = '1000';
            message.innerText = `Not Enough ${usedTheme[3]}`;
            document.body.appendChild(message);
       
            // Automatically remove the message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        }
    };
};

function buyMech() {
    if (CUENCOINS >= mechs[1]) {
        previousCuenCoins = Number(`${CUENCOINS}`);
        CUENCOINS = (previousCuenCoins - mechs[1]);
        cuenCoins.innerHTML = CUENCOINS;
        mechs[0] = mechs[0] + 1;
        RefreshInterval()
        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1); 
        mechs[1] = Math.trunc(((1.3**mechs[0]) * 10));
        storeOpen = false; 
        setTimeout(RefreshInterval(), 1); 
        toggleStore(); 
    } else {
        if (!document.getElementById('notEnoughCuenCoinsMessage')) {
            const message = document.createElement('div');
            message.id = 'notEnoughCuenCoinsMessage';
            message.style.position = 'fixed';
            message.style.top = '10%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, 0)';
            message.style.backgroundColor = '#ffcccc';
            message.style.padding = '10px 20px';
            message.style.border = '2px solid #ff6666';
            message.style.borderRadius = '5px';
            message.style.color = '#990000';
            message.style.fontSize = '16px';
            message.style.fontWeight = 'bold';
            message.style.zIndex = '1000';
            message.innerText = `Not Enough ${usedTheme[3]}`;
            document.body.appendChild(message);
       
            // Automatically remove the message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        }
    };
};
if (absoluteCCPS > 0) {
    document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
};
function Tic() {
    previousCuenCoins = CUENCOINS;
    CUENCOINS = (previousCuenCoins + 1);
    cuenCoins.innerHTML = CUENCOINS;    
    document.getElementById("title").innerHTML = (CUENCOINS + ` ${usedTheme[0][0]}`);    
};
function reset() {
    localStorage['CUENCOINS'] = String(0);
    localStorage['mechs[0]'] = String(0);
    localStorage['teams[0]'] = String(0);
    location.reload();
};

let effectActive = [false];
function spawnDuck(override) {
    var duckClicked = false;
    let randomNumber = Math.random();
    if (randomNumber < goldDuckStats[0] || override) {
        if (!effectActive[0]) {
            document.getElementById('goldenDuck').style.display = 'block';
            document.getElementById('goldenDuck').style.left = `${((Math.random() * 0.8) * window.innerWidth)}px`;
            document.getElementById('goldenDuck').style.top = `${((0.7*Math.random()) * window.innerHeight)}px`;
            document.getElementById('goldenDuck').addEventListener('click', function() {
                duckClicked = true;
                effectActive[0] = true;
                document.getElementById('STOREBUTTON').style.marginBottom = '0px'
                document.getElementById('buyTeams').style.marginTop = '200px'
                document.getElementById('buyCats').style.marginTop = '200px'
                document.getElementById('STOREBUTTON').click()
                expand()
                setTimeout(function() {
                    shrink()
                    document.getElementById('STOREBUTTON').click()
                }, 1)
                document.getElementById('goldenDuck').style.display = 'none';
                let randBuff = goldDuckBuffs[Math.floor(Math.random() * goldDuckBuffs.length)];
                if (randBuff == 'Double CCPS') {
                    let tempCcpsMultiply = ccpsMultiplier[0]*2;
                    ccpsMultiplier = [tempCcpsMultiply];
                    RefreshInterval()
                    let xTimer = goldDuckStats[1];
                    document.getElementById('goldenDuckMessage').style.display = 'block';
                    document.getElementById('buffName').innerHTML = "Double CCPS";
                    document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
                    let effectDuration = setInterval(function() {
                        document.getElementById('buffTime').innerHTML = xTimer;
                        xTimer -= 1;
                        console.log('2x Multipliers: ', xTimer)
                    }, 1000);
                    setTimeout(function() {
                        clearInterval(effectDuration);
                        document.getElementById('STOREBUTTON').style.marginBottom = '0px'
                        document.getElementById('buyTeams').style.marginTop = '0px'
                        document.getElementById('buyCats').style.marginTop = '0px'
                        document.getElementById('goldenDuckMessage').style.display = 'none';
                        ccpsMultiplier[0] = tempCcpsMultiply/2
                        RefreshInterval()
                        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
                        effectActive[0] = false
                    }, 1000*goldDuckStats[1])
                } else if (randBuff == '10x Click Power') {
                    // window.alert(clickAmount[0])
                    let tempClickMultiply = clickAmount[0]*10;
                    clickAmount[0] = tempClickMultiply;
                    // window.alert(clickAmount[0])
                    let xTimer = goldDuckStats[1];
                    document.getElementById('goldenDuckMessage').style.display = 'block';
                    document.getElementById('buffName').innerHTML = "10x Click Power";
                    let effectDuration = setInterval(function() {
                        document.getElementById('buffTime').innerHTML = xTimer;
                        xTimer -= 1;
                        console.log('10x Multiplier: ', xTimer)
                    }, 1000)
                    setTimeout(function() {
                        clearInterval(effectDuration);
                        document.getElementById('STOREBUTTON').style.marginBottom = '0px'
                        document.getElementById('buyTeams').style.marginTop = '0px'
                        document.getElementById('buyCats').style.marginTop = '0px'
                        document.getElementById('goldenDuckMessage').style.display = 'none';
                        // window.alert(tempClickMultiply)
                        clickAmount[0] = tempClickMultiply/10
                        // window.alert(clickAmount[0])
                        effectActive[0] = false
                    }, 1000*goldDuckStats[1])
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
                    } else if (unlockedBuildings[randBuildingIndex] == 'cats') {
                        previousCuenCoins = CUENCOINS;
                        CUENCOINS = (previousCuenCoins + cats[1]);
                        buyCats()
                    };
                    document.getElementById('goldenDuckMessage').style.display = 'block';
                    document.getElementById('buffName').innerHTML = "Free Random Building";
                    document.getElementById('buffTime').innerHTML = '';
                    setTimeout(function() {
                        document.getElementById('STOREBUTTON').style.marginBottom = '0px'
                        document.getElementById('buyTeams').style.marginTop = '0px'
                        document.getElementById('buyCats').style.marginTop = '0px'
                        document.getElementById('goldenDuckMessage').style.display = 'none';
                        effectActive[0] = false
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

document.getElementById("buyCats").addEventListener('mouseover', function() {
    addBuildingParam = ["cats", "infoCat", "infoCats"];
    remBuildingParam = ["cats", "infoCat", "infoCats"];
    addBuilding();
    document.getElementById("buyCats").addEventListener('mouseout', remBuilding);
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
                if (THEME == 'McCuen') {
                    document.getElementById('McCuenTheme').disabled = true;
                    document.getElementById('GarfieldTheme').disabled = false;
                } else if (THEME == 'Garfield') {
                    document.getElementById('GarfieldTheme').disabled = true;
                    document.getElementById('McCuenTheme').disabled = false;
                }
            } else {
                SETTINGTHEMESOPEN = [false];
                document.getElementById('infoTHEMES').style.display = 'none';
            }
});

document.getElementById('McCuenTheme').addEventListener('click', function() {
    usedTheme = [McCuenTextWords]
    THEME = 'McCuen'
    document.getElementById('SETTINGSBUTTON').click()
    document.body.background = 'Themes/McCuen/Background.png'
    document.getElementById('goldenDuck').src = "Themes/McCuen/GoldenThing.png"
    document.getElementById('McCuenFace').src = "Themes/McCuen/TheClicked.gif"
    for (x=0; x<4; x++) {
        var tempClassVar = document.querySelectorAll(`${(['h1', 'h2', 'h3', '.building'])[x]}`)
        tempClassVar.forEach(element => {
            element.style.color = '#ff0202';
            element.style.textShadow = '0px 3.75px 1px #000000';
        })
    }
    var tempClassVar = document.querySelectorAll(`button`)
        tempClassVar.forEach(element => {
            element.style.backgroundColor = '#fe3030';
        })
    document.getElementById('infoTHEMES').style.backgroundColor = 'rgb(77, 0, 0)'
    document.getElementById('SETTINGSMENU').style.backgroundColor = 'red'

    var tempClassVar = document.querySelectorAll(`.buildingInfoHidden`)
        tempClassVar.forEach(element => {
            element.style.backgroundColor = '#ff5050';
        })
        
    var tempClassVar = document.querySelectorAll(`themetext`)
    tempClassVar.forEach(element => {
        if (element.textContent == 'GPS') {
            element.textContent = 'CCPS'
        } else if (element.textContent == 'Gps') {
            element.textContent = 'Ccps'
        } else if (element.textContent == 'gps') {
            element.textContent = 'ccps'
        } else if (element.textContent == 'Garfs') {
            element.textContent = 'CuenCoins'
        } else if (element.textContent == 'Garfield') {
            element.textContent = 'McCuen'
        } else if (element.textContent == 'Lasagna') {
            element.textContent = 'Mechanical Keyboards'
        } else if (element.textContent == 'lasagnas') {
            element.textContent = 'Mechs'
        } else if (element.textContent == 'Fingers') {
            element.textContent = 'Microsoft Teams'
        } else if (element.textContent == 'fingers') {
            element.textContent = 'Teams'
        } 
        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
    })
});

document.getElementById('GarfieldTheme').addEventListener('click', function() {

    // This part changes all the colors of the theme
    usedTheme = [GarfieldTextWords]
    THEME = 'Garfield'
    document.getElementById('SETTINGSBUTTON').click()
    document.body.background = 'Themes/Garfield/Background.png'
    document.getElementById('goldenDuck').src = "Themes/Garfield/GoldenThing.png"
    document.getElementById('McCuenFace').src = "Themes/Garfield/TheClicked.png"
    for (x=0; x<4; x++) {
        var tempClassVar = document.querySelectorAll(`${(['h1', 'h2', 'h3', '.building'])[x]}`)
        tempClassVar.forEach(element => {
            element.style.color = '#fed330';
            element.style.textShadow = '0px 3.75px 1px #000000';
        })
    }
    var tempClassVar = document.querySelectorAll(`button`)
        tempClassVar.forEach(element => {
            element.style.backgroundColor = '#f8a5c2';
        })
    document.getElementById('infoTHEMES').style.backgroundColor = '#ff9f43'
    document.getElementById('SETTINGSMENU').style.backgroundColor = '#ffa542'

    var tempClassVar = document.querySelectorAll(`.buildingInfoHidden`)
        tempClassVar.forEach(element => {
            element.style.backgroundColor = '#ff9f43';
        })

    // this part changes all the actual text of the theme
    var tempClassVar = document.querySelectorAll(`themetext`)
    tempClassVar.forEach(element => {
        if (element.textContent == 'CCPS') {
            element.textContent = 'GPS'
        } else if (element.textContent == 'Ccps') {
            element.textContent = 'Gps'
        } else if (element.textContent == 'ccps') {
            element.textContent = 'gps'
        } else if (element.textContent == 'CuenCoins') {
            element.textContent = 'Garfs'
        } else if (element.textContent == 'McCuen') {
            element.textContent = 'Garfield'
        } else if (element.textContent == 'Mechanical Keyboards') {
            element.textContent = 'Lasagna'
        } else if (element.textContent == 'Mechs') {
            element.textContent = 'lasagnas'
        } else if (element.textContent == 'Microsoft Teams') {
            element.textContent = 'Fingers'
        } else if (element.textContent == 'Teams') {
            element.textContent = 'fingers'
        } 
        document.getElementById("CCPS").innerHTML = `${usedTheme[0][0]}: ` + absoluteCCPS.toFixed(1);
    })
});

// clicker.js

document.addEventListener('DOMContentLoaded', () => {
    // Existing initializations...

    // Theme Variables
    const themes = {
        McCuen: {
            background: 'Themes/McCuen/Background.png',
            particleImage: 'Themes/McCuen/star.png',
            clickedImageAnimation: 'shake-rotate'
        },
        Garfield: {
            background: 'Themes/Garfield/Background.png',
            particleImage: 'Themes/Garfield/star.png',
            clickedImageAnimation: 'shake-rotate'
        }
    };

    // Theme Initialization
    const body = document.body;
    const html = document.documentElement;

    // Function to switch themes
    function switchTheme(themeName) {
        // Remove existing theme classes
        body.classList.remove('theme-McCuen', 'theme-Garfield');
        html.classList.remove('theme-McCuen', 'theme-Garfield');

        // Add new theme class
        body.classList.add(`theme-${themeName}`);
        html.classList.add(`theme-${themeName}`);

        // Change background image
        body.style.backgroundImage = `url('${themes[themeName].background}')`;
    }

    // Theme Switch Buttons
    document.getElementById('McCuenTheme').addEventListener('click', () => {
        switchTheme('McCuen');
        // Additional logic for theme change if necessary
        // For example, changing images based on the theme
    });

    document.getElementById('GarfieldTheme').addEventListener('click', () => {
        switchTheme('Garfield');
        // Additional logic for theme change if necessary
    });

    // Clickable Images Animation
    const clickableImages = document.querySelectorAll('img#goldenDuck, img#McCuenFace');

    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            // Add 'clicked' class to trigger CSS animation
            img.classList.add('clicked');

            // Remove the class after animation completes to allow re-triggering
            setTimeout(() => {
                img.classList.remove('clicked');
            }, 500); // Duration matches the CSS animation duration
        });
    });

    // Boss Battle Elements
    const bossBattleModal = document.getElementById('bossBattleModal');
    const bossBattleTrigger = document.getElementById('bossBattleTrigger');
    const startBossBattleBtn = document.getElementById('startBossBattle');
    const exitBossBattleBtn = document.getElementById('exitBossBattle');
    const bossStatus = document.getElementById('bossStatus');
    const gameContainers = document.querySelectorAll('.game-container');

    // Initialize Mini-Games
    const miniGames = [initWhackAMole, initMemoryMatch, initQuickReaction];
    let currentGame = null;

    // Vibrations
    function vibratePattern(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    // Start Boss Battle
    bossBattleTrigger.addEventListener('click', () => {
        startBossBattle();
    });

    startBossBattleBtn.addEventListener('click', () => {
        startBossBattle();
    });

    // Exit Boss Battle
    exitBossBattleBtn.addEventListener('click', () => {
        endBossBattle(false);
    });

    function startBossBattle() {
        // Show Boss Battle Modal
        bossBattleModal.style.display = 'block';
        bossStatus.textContent = 'Choose your challenge!';
        startBossBattleBtn.style.display = 'none';
        exitBossBattleBtn.style.display = 'block';

        // Randomly select a mini-game
        const randomIndex = Math.floor(Math.random() * miniGames.length);
        currentGame = miniGames[randomIndex];
        currentGame();

        // Vibrate on Start
        vibratePattern(100);
    }

    function endBossBattle(victory) {
        // Hide Boss Battle Modal
        bossBattleModal.style.display = 'none';

        // Show start button again
        startBossBattleBtn.style.display = 'block';
        exitBossBattleBtn.style.display = 'none';

        // Vibrate on End
        if (victory) {
            vibratePattern([200, 100, 200]);
            addCoins(500); // Reward coins
            bossStatus.textContent = 'Victory! You gained 500 CuenCoins!';
        } else {
            vibratePattern(50);
            bossStatus.textContent = 'You exited the battle.';
        }

        // Reset and hide all game containers
        gameContainers.forEach(container => {
            container.style.display = 'none';
        });
    }

    // Utility function to add coins
    function addCoins(amount) {
        let currentCoins = parseInt(document.getElementById('cuenCoins').textContent);
        document.getElementById('cuenCoins').textContent = currentCoins + amount;
    }

    // ------------------------------
    // Mini-Game 1: Whack-a-Mole
    // ------------------------------
    function initWhackAMole() {
        const game = document.getElementById('whackAMoleGame');
        const moleContainer = document.getElementById('moleContainer');
        const scoreDisplay = document.getElementById('wackScore');
        const timeDisplay = document.getElementById('wackTime');
        let score = 0;
        let timeLeft = 30;
        let moleTimer = null;
        let countdownTimer = null;

        // Setup UI
        gameContainers.forEach(container => container.style.display = 'none');
        document.getElementById('game1').style.display = 'block';

        // Start Game
        function startGame() {
            moleTimer = setInterval(showMole, 1000);
            countdownTimer = setInterval(updateTimer, 1000);
        }

        // Show Mole
        function showMole() {
            moleContainer.innerHTML = ''; // Clear previous mole
            const mole = document.createElement('div');
            mole.classList.add('mole');
            mole.style.width = '80px';
            mole.style.height = '80px';
            mole.style.backgroundImage = 'url(\'https://i.imgur.com/0y8K0Zf.png\')'; // Mole image URL
            mole.style.backgroundSize = 'cover';
            mole.style.position = 'absolute';
            mole.style.left = Math.random() * (moleContainer.offsetWidth - 80) + 'px';
            mole.style.top = Math.random() * (moleContainer.offsetHeight - 80) + 'px';
            mole.style.cursor = 'pointer';
            mole.addEventListener('click', hitMole);
            moleContainer.appendChild(mole);
        }

        // Hit Mole
        function hitMole() {
            score++;
            scoreDisplay.textContent = score;
            moleContainer.innerHTML = '';
            vibratePattern(50);
        }

        // Update Timer
        function updateTimer() {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }

        // End Game
        function endGame() {
            clearInterval(moleTimer);
            clearInterval(countdownTimer);
            moleContainer.innerHTML = '';
            alert(`Whack-a-Mole Over! Your Score: ${score}`);
            if (score >= 20) {
                endBossBattle(true);
            } else {
                endBossBattle(false);
            }
        }

        // Start the game
        startGame();
    }

    // ------------------------------
    // Mini-Game 2: Memory Match
    // ------------------------------
    function initMemoryMatch() {
        const game = document.getElementById('memoryMatchGame');
        const cardContainer = document.getElementById('cardContainer');
        const scoreDisplay = document.getElementById('memoryScore');
        const timeDisplay = document.getElementById('memoryTime');
        let score = 0;
        let timeLeft = 60;
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let matchedPairs = 0;
        const totalPairs = 8; // Total pairs to match

        // Setup UI
        gameContainers.forEach(container => container.style.display = 'none');
        document.getElementById('game2').style.display = 'block';

        // Generate Cards
        const images = [];
        for (let i = 1; i <= totalPairs; i++) {
            images.push(i);
            images.push(i);
        }
        shuffle(images);

        // Create Card Elements
        images.forEach(num => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.number = num;
            card.style.width = '100px';
            card.style.height = '100px';
            card.style.margin = '10px';
            card.style.backgroundColor = '#444';
            card.style.display = 'inline-block';
            card.style.position = 'relative';
            card.style.cursor = 'pointer';
            card.style.borderRadius = '10px';
            card.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
            card.style.backgroundSize = 'cover';
            card.style.backgroundImage = `url('https://via.placeholder.com/100?text=?')`; // Back of card

            card.addEventListener('click', () => {
                if (lockBoard) return;
                if (card === firstCard) return;
                revealCard(card);

                if (!firstCard) {
                    firstCard = card;
                    vibratePattern(20);
                    return;
                }

                secondCard = card;
                checkForMatch();
            });

            cardContainer.appendChild(card);
        });

        // Shuffle Function
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Reveal Card
        function revealCard(card) {
            const theme = body.classList.contains('theme-McCuen') ? 'McCuen' : 'Garfield';
            card.style.backgroundImage = `url('https://via.placeholder.com/100/ffffff?text=${card.dataset.number}')`;
            card.style.backgroundSize = 'cover';
            vibratePattern(10);
        }

        // Hide Cards
        function hideCards() {
            firstCard.style.backgroundImage = `url('https://via.placeholder.com/100?text=?')`;
            secondCard.style.backgroundImage = `url('https://via.placeholder.com/100?text=?')`;
            resetBoard();
        }

        // Check for Match
        function checkForMatch() {
            const isMatch = firstCard.dataset.number === secondCard.dataset.number;
            if (isMatch) {
                disableCards();
                score++;
                scoreDisplay.textContent = score;
                matchedPairs++;
                vibratePattern([100, 50, 100]);

                if (matchedPairs === totalPairs) {
                    endGame();
                }
            } else {
                lockBoard = true;
                setTimeout(hideCards, 1000);
            }
        }

        // Disable Cards
        function disableCards() {
            firstCard.removeEventListener('click', () => {});
            secondCard.removeEventListener('click', () => {});
            resetBoard();
        }

        // Reset Board
        function resetBoard() {
            [firstCard, secondCard] = [null, null];
            lockBoard = false;
        }

        // Update Timer
        let countdownTimer = setInterval(updateTimer, 1000);

        function updateTimer() {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }

        // End Game
        function endGame() {
            clearInterval(countdownTimer);
            if (matchedPairs === totalPairs) {
                alert(`Memory Match Over! You matched all pairs with score: ${score}`);
                endBossBattle(true);
            } else {
                alert(`Memory Match Over! You matched ${matchedPairs} pairs.`);
                endBossBattle(false);
            }
        }
    }

    // ------------------------------
    // Mini-Game 3: Quick Reaction
    // ------------------------------
    function initQuickReaction() {
        const game = document.getElementById('quickReactionGame');
        const target = document.getElementById('target');
        const scoreDisplay = document.getElementById('reactionScore');
        const timeDisplay = document.getElementById('reactionTime');
        let score = 0;
        let timeLeft = 30;
        let targetTimer = null;
        let countdownTimer = null;

        // Setup UI
        gameContainers.forEach(container => container.style.display = 'none');
        document.getElementById('game3').style.display = 'block';

        // Style Target
        target.style.width = '50px';
        target.style.height = '50px';
        target.style.backgroundColor = '#00ff00';
        target.style.borderRadius = '50%';
        target.style.position = 'absolute';
        target.style.display = 'none';
        target.style.cursor = 'pointer';
        target.style.transition = 'transform 0.2s ease';

        target.addEventListener('click', hitTarget);

        // Start Game
        function startGame() {
            targetTimer = setInterval(showTarget, 1000);
            countdownTimer = setInterval(updateTimer, 1000);
        }

        // Show Target
        function showTarget() {
            const container = game.getBoundingClientRect();
            const x = Math.random() * (container.width - 50);
            const y = Math.random() * (container.height - 50);
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
            target.style.display = 'block';
            // Add a slight rotation for visual effect
            target.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
            vibratePattern(20);
        }

        // Hit Target
        function hitTarget() {
            score++;
            scoreDisplay.textContent = score;
            target.style.display = 'none';
            vibratePattern(10);
        }

        // Update Timer
        function updateTimer() {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }

        // End Game
        function endGame() {
            clearInterval(targetTimer);
            clearInterval(countdownTimer);
            target.style.display = 'none';
            alert(`Quick Reaction Over! Your Score: ${score}`);
            if (score >= 15) {
                endBossBattle(true);
            } else {
                endBossBattle(false);
            }
        }

        // Start the game
        startGame();
    }

});