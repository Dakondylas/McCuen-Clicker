/*
const body = document.getElementById("body");
const testText = document.getElementById("test");
let windowWidth = window.screen.width;
let windowHeight = window.screen.height;
window.alert(windowWidth);
window.alert(windowHeight);
let rgb = [0, 0, 0];
let xCord = [0];
let yCord = [0];
*/
let mouseOver = []
let previousMouseOver = []
function mouseOverListChange() {
    if (mouseOver != previousMouseOver) {
        if ((mouseOver.includes("bye") != false) || (mouseOver.includes("hey") != false)){
            if (document.getElementById("hey").className == "buildingHover") {
                document.getElementById("hey").className = "buildingContent";
                document.getElementById("hey").classList.replace("buildingHover", "buildingContent");
            };
        } else {
            document.getElementById("hey").className = "buildingHover";
            document.getElementById("hey").classList.replace("buildingContent", "buildingHover");
        };
        
        previousMouseOver = [];
        for (x=0; x<mouseOver.length; x++) {
            previousMouseOver.push(mouseOver[x]);
        };
    };
};

function arrayRemove(array, stringRemoved) {
    let newArray = [];
    for (i=0; i<array.length; i++) {
        if (array[i] != stringRemoved) {
            newArray.push(array[i]);
        } else {
            continue;
        };
    };
    return newArray;

};


let addBye = document.getElementById("bye").addEventListener('mouseover', function() {
    if (mouseOver.includes("bye") != true) {
        mouseOver.push("bye");
        mouseOverListChange();
    };
});



let remBye = document.getElementById("bye").addEventListener('mouseout', function() {
    let addHey = document.getElementById("hey").addEventListener('mouseover', function() {
        
        if (mouseOver.includes("hey") != true) {
            mouseOver.push("hey");
            mouseOverListChange()
        };
    });

    document.getElementById("hey").addEventListener('mouseout', function() {
        if (mouseOver.includes("hey")) {
            
            mouseOver = arrayRemove(mouseOver, "hey");
            mouseOverListChange();
        };
    });

    if (mouseOver.includes("bye")) {
        mouseOver = arrayRemove(mouseOver, "bye");
        mouseOverListChange()
    };
});
