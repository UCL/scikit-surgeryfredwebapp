//========================================================================
// SciKit-SurgeryFRED front end
//========================================================================

//global variables

//store the contour for the intra-opimage
var intraOpContour = [];

//lists of fiducial markers and target
const preOpFids = []   //moving
const intraOpFids = [] //fixed

//the fiducial localisation errors
const preOpFLEStdDev = []
const intraOpFLEStdDev = []
const preOpFLEStdEAV = []
const intraOpFLEStdEAV = []

//page elements for convenience
var preOpImage = document.getElementById("pre-operative-image");
var preOpCanvas = document.getElementById("pre-operative-canvas");
var intraOpImage = document.getElementById("intra-operative-image");

// Add event listeners

preOpCanvas.addEventListener("click", preOpImageClick)
intraOpImage.addEventListener("click", intraOpImageClick)


function loadDefaultContour() {
  fetch("/defaultcontour", {
    method: "POST",
    })
    .then(resp => {
      console.log("resp");
      if (resp.ok)
        resp.json().then(data => {
	  console.log("resp OK");
          drawOutline(data);
      });
    })
    .catch(err => {
      console.log("error");

      console.log("An error occured", err.message);
      window.alert("An error occured when loading default contour.");
    });

}

//========================================================================
// Web page elements for functions to use
//========================================================================

var uploadCaptionL = document.getElementById("upload-caption-l");
var loader = document.getElementById("loader");

//Do this at start up
loadDefaultContour();

//========================================================================
// Main button events
//========================================================================

function preOpImageClick(evt) {
	console.log("PreOp Image Clicked", evt);
	placeFiducial(evt.layerX, evt.layerY);
}

function intraOpImageClick(evt) {
	console.log("IntraOp Image Clicked", evt);
	placeFiducial(evt.layerX, evt.layerY);
}

function changeImage() {
  // action for the change image button
  console.log("Change Image not Implemented");

  window.alert("Change image not implemented!");
  return;
}

function reset(){
  console.log('reset');
  resetTarget();
//  init_fles();
}

function placeFiducial(x, y) {
	console.log("Place fidicuial,",x, y);
  fetch("/placefiducial", {
      method: "POST",
      headers: {
	"Content-Type": "application/json"
      },
      body: JSON.stringify([x, y])
    })
    .then(resp => {
      console.log("New Target");
      if (resp.ok)
        resp.json().then(data => {
          console.log(data);
      });
    })
    .catch(err => {
      console.log("error");

      console.log("An error occured fetching new target", err.message);
      window.alert("An error occured fetching new target");
    });


}


//========================================================================
// Helper functions
//========================================================================

function contourImage(image_l) {
  console.log("contour");

  fetch("/contour", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(image_l)
    })
    .then(resp => {
      console.log("resp");
      if (resp.ok)
      	resp.json().then(data => {
	  console.log("resp OK");
          drawOutline(data);
      });
    })
    .catch(err => {
      console.log("error");

      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function resetTarget() {
  fetch("/gettarget", {
      method: "POST",
      headers: {
	"Content-Type": "application/json"
      },
      body: JSON.stringify(intraOpContour)
    })
    .then(resp => {
      console.log("New Target");
      if (resp.ok)
        resp.json().then(data => {
          drawTarget(data);
      });
    })
    .catch(err => {
      console.log("error");

      console.log("An error occured fetching new target", err.message);
      window.alert("An error occured fetching new target");
    });

}

function init_fles() {
  fetch("/getfle", {
      method: "POST",
      headers: {
	"Content-Type": "application/json"
      },
      body: JSON.stringify(intraOpContour)
    })
    .then(resp => {
      console.log("New Target");
      if (resp.ok)
        resp.json().then(data => {
	console.log(data);
      });
    })
    .catch(err => {
      console.log("error");

      console.log("An error occured fetching new target", err.message);
      window.alert("An error occured fetching new target");
    });

}



//========================================================================
// Drawing Functions
//========================================================================
function drawOutline(data) {
  console.log("received");
  intraOpContour = data.contour;
  var canvas = intraOpImage; 
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 3;
    ctx.beginPath();
    intraOpContour.forEach(function (item, index) {
      ctx.lineTo(item[1], item[0]);
    });
    ctx.closePath();
    ctx.stroke();
  }
 
}


function drawTarget(data) {
  var canvas = preOpCanvas;
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#880000";
    ctx.beginPath();
    ctx.arc(data.target[0][1], data.target[0][0], 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawFiducial(actual_position, measured_position){
}

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
