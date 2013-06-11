
var mouseX, mouseY;
var radius = 50, segments = 100, rings = 100;
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight,
  VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 1000;
var renderer;
var camera;
var scene;
var pointLight;
var projector = new THREE.Projector();
var objects = new Array();
var plates = [];
var button;
var controls;
var isMouseDown = false, onMouseDownPosition;
var arrow = [];

var onFrame;

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
/*
  var container = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
*/
  $('#game-window-content').empty();
  $('#game-window-content').append(renderer.domElement);
  console.log("WIDTH, HEIGHT of window: " + $('#game-window-content').width() + "; " + $('#game-window-content').height());
  //WIDTH = $('#game-window-content').width();
  //HEIGHT = $('#game-window-content').height();
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mouseup', onMouseUp, false);
  scene = new THREE.Scene();
  pointLight = makePointLight();
  scene.add(pointLight);
  camera = makeCamera();
  scene.add(camera);
 
  //window resize on mouse drag/scroll
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
  
  //controls
  controls = new THREE.TrackballControls(camera); 

  plates = makePlates();
  arrow = makeArrow();
  onMouseDownPosition = new THREE.Vector2();
  renderer.render(scene, camera);

  animate();
}

function cancelGame()
{
  window.cancelAnimationFrame(onFrame);
  gameState = false;
  $('#game-window-content').empty();
  document.removeEventListener('mousedown', onMouseDown, false);
  document.removeEventListener('mouseup', onMouseUp, false);
}

function trick(e)
{
  console.log(e);
}

function animate() 
{
  onFrame = window.requestAnimationFrame(animate);
  renderer.render(scene, camera);  
  controls.update();
}

function onMouseDown(event) {
  event.preventDefault();
  isMouseDownn = true;
  onMouseDownPosition.x = event.clientX;
  onMouseDownPosition.y = event.clientY;
}

function getClickedObjects(event) {
  var vector = new THREE.Vector3((event.clientX / WIDTH) 
    *2 - 1, - (event.clientY / HEIGHT) * 2 + 1, 0.5);
  projector.unprojectVector(vector, camera);
  var raycaster = new THREE.Raycaster(camera.position, 
    vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(objects);
  return intersects;
}


function onMouseUp(event) {
  var clicked, pno, x, y;
  event.preventDefault();
  isMouseDown = false; 
  onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
  onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
  if ( onMouseDownPosition.length() > 5 ) {
    return;
  } 

  var intersects = getClickedObjects(event);
  
  if (intersects.length > 0) {
      clicked = intersects[intersects.length-1].object;
      x = clicked.position.x;
      y = clicked.position.y;
      pno = getPlateNumber(clicked.position.x, clicked.position.z); 
      clickBowl(pno);
  }
}
