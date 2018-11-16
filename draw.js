var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');



function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousedown', function(evt) {
  trackLine(displayLine)
}, false)

function trackLine(callback){
  var lineArray = []
  function captureLineSegment(event){
    lineArray.push(getMousePos(canvas, event));
  }

  function stopCapture(){
    canvas.removeEventListener('mousemove', captureLineSegment, false)
    callback(lineArray)
  }

  let tracker = canvas.addEventListener('mousemove', captureLineSegment, false)
  let killer = canvas.addEventListener('mouseup', stopCapture , false)
}

function displayLine(lineArray){
  ctx.beginPath();
  ctx.moveTo(lineArray[0].x,lineArray[0].y);
  for (var i = 1; i < lineArray.length; i++){
    ctx.lineTo(lineArray[i].x,lineArray[i].y)
  }
  ctx.stroke();
}