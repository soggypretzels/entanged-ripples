const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let clearButton = document.querySelector('#clearButton');
clearButton.addEventListener("click", resetDrawing)

let replayButton = document.querySelector('#replayButton');
replayButton.addEventListener("click", ()=>{
  clearCanvas()
  playback(strokeList)
})

let strokeList = []

function resetDrawing() {
  strokeList = [] //clear lines
  clearCanvas() //clean screen
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousedown', async function(evt) {
  let stroke = await recordLine()
  strokeList.push(stroke)
  displayLine(stroke)
}, false)

function recordLine() {
  return new Promise(resolve => {
  	ctx.beginPath();
    let lastSegmentTime = new Date();
    var lineArray = []
    function captureLineSegment(event) {
      data = getMousePos(canvas, event)
      data.relativeTimeDelta = getTimeDelta()
      lineArray.push(data);
      drawSegment(data)
    }

    function stopCapture() {
      canvas.removeEventListener('mousemove', captureLineSegment, false)
      resolve(lineArray)
    }

    function getTimeDelta() {
      let delta = new Date() - lastSegmentTime
      lastSegmentTime = new Date()
      return (delta)
    }

    let tracker = canvas.addEventListener('mousemove', captureLineSegment, false)
    let killer = canvas.addEventListener('mouseup', stopCapture , false)
  });
}


let timeouts = []

async function displayLine(lineArray, realtime, initalDelay) {
	ctx.beginPath();
  let timeIndex = initalDelay
  timeouts.push(setTimeout(()=>{
	  ctx.moveTo(lineArray[0].x,lineArray[0].y);
	}, timeIndex))

  for (var i = 1; i < lineArray.length; i++){
  	timeIndex += lineArray[i].relativeTimeDelta
  	let thisSegment = lineArray[i]
  	let timeoutId = setTimeout(()=>{
  		drawSegment(thisSegment)
  	}, timeIndex)
  	timeouts.push(timeoutId)
  }
  //ctx.stroke();
}


function drawSegment(segment) {
	ctx.lineTo(segment.x,segment.y)
	ctx.stroke();
}

function delaySegment(delay){
  return new Promise(resolve => {
    timeout = setTimeout(()=>{
      ctx.stroke();
      resolve()
    }, delay);
  });
}

function playback(strokeList) {
	let sequenceDelay = 0
  for (line of strokeList){
    displayLine(line, true, sequenceDelay)
    console.log(getStrokeDuration(line))
    sequenceDelay += getStrokeDuration(line) //only start drawing the stroke once the others have finished
  }
}

function getStrokeDuration(stroke){
	let duration = stroke.reduce((total, thisSegment) => {
		console.log(total)
		return(total + thisSegment.relativeTimeDelta)
	}, 0)
	return (duration)
}