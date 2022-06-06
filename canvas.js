let canvas = document.querySelector("canvas"); //access of the canvas
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".fa-download");
let undoButton = document.querySelector(".fa-undo");
let redoButton = document.querySelector(".fa-redo");
// The returned value is a DOMRect object 
// which is the smallest rectangle which 
// contains the entire element, including its padding and border-width.
//  The left, top, right, bottom, x, y, width, and height properties
//   describe the position and size of the overall rectangle in pixels. 
//   Properties other than width and height are relative to the top-left of the viewport.
let DeleteHTML = document.querySelector(".fa-trash-alt");
let boardLeft = canvas.getBoundingClientRect().left;
let boardTop = canvas.getBoundingClientRect().top;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let penColor = "black";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //contains the action which iperformed on the board;
let track = 0; //represent the data after clicking on undo and redo;

let mouseDown = false;

//API -> to access all the tools of the canvas
let tool = canvas.getContext("2d");
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

canvas.addEventListener("mousedown", function(e) {
    mouseDown = true;
    beginPath({
        x: e.clientX + boardLeft,
        y: e.clientY + boardTop
    })
})

canvas.addEventListener("mousemove", function(e) {
    if (mouseDown) {
        drowStroke({
            x: e.clientX + boardLeft,
            // provides the vertical coordinate within the application's viewport at which the event occurred 
            y: e.clientY + boardTop
        })
    }s
})

canvas.addEventListener("mouseup", function(e) {
    mouseDown = false;

    //here some graphics has been occur so here we can push our data
    // into tracker so that we can perform redo undo fn
    // toDataURL() method returns a data URL containing a representation of 
    // the image in the format specified by the type parameter.
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

//undo
undoButton.addEventListener("click", function() {
    if (track > 0) track--;

    //Track action -> back to previous data
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})

//redo
redoButton.addEventListener("click", function() {
    if (track < undoRedoTracker.length - 1) track++;

    //Track action -> back to previous data
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); //new image for refrence element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

//begin path

// The stroke() method of the HTML
//  canvas is used to draw the path. 
//  This path is drawn with moveTo() and lineTo() method
function beginPath(StrokeObj) {
    tool.beginPath();
    tool.moveTo(StrokeObj.x, StrokeObj.y);
}

//drwing
function drowStroke(StrokeObj) {
    tool.lineTo(StrokeObj.x, StrokeObj.y);
    tool.stroke();
}

//pencil Color
pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", function() {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

//pencil Width
pencilWidthElem.addEventListener("change", function() {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

//eraser Width
eraserWidthElem.addEventListener("change", function() {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", function() {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = pencilWidth;
    }
})

//download board data ass image
download.addEventListener("click", function() {
    //toDataURL -> is used to convert the data into url
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// delete the content from the canvas;
DeleteHTML.addEventListener("click", function() {
    tool.clearRect(0, 0, canvas.width, canvas.height);
})