
var PLATES_NO = 12;
var MAX_BALL_NO = 48;
var INITIAL_BALL_NO = 4;

function makePlates() {
  var plates = [];
  var geometry;
  var material;
  var positions = [];
  $.ajax({
    url:'plates.json', 
    async: false,
    dataType: 'json',
    success: function(data) { 
      geometry = data.geometries[0];
      material = data.materials[0];
      positions = data.object.children;
    }
  });
  for (i = 0; i < positions.length; i++) {
    plates[i] = [makePlate(geometry, material, positions[i]), new Array(MAX_BALL_NO)];
    plates[i][0].name = "plate_" + i;
    plates[i][0].id = i;
    scene.add(plates[i][0]);
    objects.push(plates[i][0]);
  } 
  return plates;
}

function gameStartPutBalls(plates) {
  for(i = 0; i < PLATES_NO; i++) {
    plates[i] = putBall(plates[i], 0);
  }
}

function putBalls(plate, number) {
  for (var i = 0; i < number; i++) {
    //plate = putBall(plate, number-1);
  }
  //return plate;
}

function putBall(plate, index) {
  var curr_balls = plate[1];
  var mesh = plate[0];
  curr_balls[index] = makeSphere (mesh.position.x, mesh.position.y+20, 
    mesh.position.z);
  scene.add(curr_balls[0]);
  //newBallCoordinates(curr_balls);
  var takenPositions = takenBallPositions(curr_balls);
  //alert(takenPositions.length);
  return plate;
}

function makeSphere(x, y, z) {
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random()
  });
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(20, 20, 20), 
    sphereMaterial 
  );
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  return sphere;
}

//avoid collision
function takenBallPositions(curr_balls) {
  var takenPositions = [];
  var index = 0;
  var xPos, yPos;
  /*while(curr_balls[index++] != null) {
    xPos = curr_balls[index-1].position.x; 
    yPos = curr_balls[index-1].position.z;
    takenPositions[index-1] = [xPos, yPos];
  }*/
  return takenPositions;
}

function getNewBallCoordinates(curr_balls, plateX, plateY) {
  var taken = takenBallPositions(curr_balls);
  var xPos = plateX;
  var yPos = plateY;
  var amount = 20;
  var success = false;
  //while(!success) {
    //success = tryAroundPosition(taken, xPos, yPos, amount);
  //}
}
