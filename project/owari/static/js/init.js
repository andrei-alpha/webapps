
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
var scoreBoards = [];
var arrow = [];
var text = [];

var onFrame;

function initGraphics()
{
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  $('#game-window').empty();
  $('#game-window').fadeIn(1000);
  $('#game-window').append(renderer.domElement);
  //$('#chat-input').focus();
  $('#game-window').on("click", onMouseClick);
  scene = new THREE.Scene();

  camera = makeCamera();
  camera.lookAt(scene.position);
  scene.add(camera);

  pointLight = makePointLight();
  scene.add(pointLight);

  //window resize on mouse drag/scroll
  //THREEx.WindowResize(renderer, camera);
  //THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});
  
  //controls
  controls = new THREE.TrackballControls(camera, renderer.domElement); 

  plates = makePlates();
  scene.add(plates);
  
  scoreBoards = makeScoreBoards();
  scene.add(scoreBoards);

  arrow = makeArrow();
  
  onMouseDownPosition = new THREE.Vector2();
  renderer.render(scene, camera);

  animate();
}

function cancelGraphics()
{
  window.cancelAnimationFrame(onFrame);
  gameState = false;
  $('#game-window').empty();
  $('#game-window').fadeOut(1000);
  $('#game-window').off("click");
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

function onMouseClick(event) {
  var clicked, pno, x, y;
  var intersects = getClickedObjects(event);
  if (intersects.length > 0) {
      clicked = intersects[intersects.length-1].object;
      x = clicked.position.x;
      y = clicked.position.y;
      pno = getPlateNumber(clicked.position.x, clicked.position.z); 
      clickBowl(pno);
  }
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
