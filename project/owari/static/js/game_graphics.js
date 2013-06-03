
var PLATES_NO = 12;
var MAX_BALL_NO = 20;
var INITIAL_BALL_NO = 4;
var BALL_RADIUS = 20;
var MAX_BALLS = 48;

function makePlates() {
  var plates = [];
  var geometry;
  var material;
  var positions = [];

  $.ajax({
    url:'/static/js/plates.json', 
    async: false,
    dataType: 'json',
    success: function(data) { 
      geometry = data.geometries[0];
      material = data.materials[0];
      positions = data.object.children;
    }
  });

  for (var i = 0; i < positions.length; i++) {
    plates[i] = [makePlate(geometry, material, positions[i]), []];
    plates[i].id = i;
    scene.add(plates[i][0]);
    objects.push(plates[i][0]);
    
    plates[i][1] = putBalls(plates[i], INITIAL_BALL_NO);

    for (var j = 0; j < plates[i][1].length; j++) {
      scene.add(plates[i][1][j]);
      objects.push(plates[i][1][j]);
    }
  } 
  return plates;
}

function putBalls(plate, number) {
  var curr_balls = plate[1];
  if (number > MAX_BALLS) 
    return curr_balls; 
  for (var i = 0; i < number; i++) {
    curr_balls = incBallsNo(plate);
    scene.add(curr_balls[curr_balls.length-1]);
  }
  return curr_balls;
}
/*
function runTurn(plateNo) {
  var plate = plates[plateNo];
  var curr_balls = plate[1];
  var curr_balls_no = curr_balls.length;
  var pos = getPlatePosition(plateNo);
  var plateX = pos[0];
  var plateY = pos[1];
  var nextPlateIndex = getNextPlate(plateNo);
  var ball;
  var nextPlate, nextPBalls; 
  var result;

  for (i = 0; i < curr_balls_no; i++) {

    nextPlate = plates[nextPlateIndex];
    if (nextPlate != plateNo) {
      nextPBalls = incBallsNo(nextPlate);

      result = decBallsNo(plate);
      plate[1] = result[0];
      curr_balls = result[0];

      ball = nextPBalls[nextPBalls.length-1];
      ball.material.color 
        = result[1].material.color;

      scene.add(nextPBalls[nextPBalls.length-1]);
      nextPlateIndex = getNextPlate(nextPlateIndex);
    }
          nextPlateIndex = getNextPlate(nextPlateIndex);
  } 
  console.log("curr ball no on plate after turn " + curr_balls_no);
  return curr_balls;
}
*/
function incBallsNo(plate) {
  var curr_balls = plate[1];
  var plateX = plate[0].position.x;
  var plateY = plate[0].position.z;
  var curr_balls_no = curr_balls.length;
  if (curr_balls_no >= MAX_BALLS) 
    return curr_balls;

  var new_pos = getBallPositions(curr_balls_no+1);
  var index = 0;
  var x, y;

  //move current balls
  while (curr_balls_no-- > 0) {
    x = new_pos[index][0];
    y = new_pos[index][1];
    curr_balls[index].position.x = (plateX + 2*BALL_RADIUS*x);
    curr_balls[index++].position.z = (plateY + 2*BALL_RADIUS*y);
  }

  //add a new ball to the last position given
  x = new_pos[index][0];
  y = new_pos[index][1];
  curr_balls[index] = makeSphere(plateX + 2*BALL_RADIUS*x, 20, 
    plateY + 2*BALL_RADIUS*y);

  return curr_balls;
}

function decBallsNo(plate) {
  var curr_balls = plate[1];
  var plateX = plate[0].position.x;
  var plateY = plate[0].position.z;
  var curr_balls_no = curr_balls.length;
  if (curr_balls_no <= 0) {
    return [[], []];
  }
  else if (curr_balls_no == 1) {
    scene.remove(curr_balls[0]);
    return [[], curr_balls[0]];
  }

  var new_pos = getBallPositions(curr_balls_no-1);
  var index = 0;
  var x, y;
  var new_curr_balls = [];
  var result = [[], curr_balls[--curr_balls_no]];
  scene.remove(curr_balls[curr_balls_no]);

  //move current balls
  while (curr_balls_no-- > 0) {
    x = new_pos[index][0];
    y = new_pos[index][1];
    curr_balls[index].position.x = (plateX + 2*BALL_RADIUS*x);
    curr_balls[index].position.z = (plateY + 2*BALL_RADIUS*y);
    new_curr_balls[index] = curr_balls[index++];
  }
  result[0] = new_curr_balls;
  return result;
}

function getPlateNumber(x, y) {
  var positions = readPlateJson();
  for (var i = 0; i < positions.length; i++) {
    if (x == positions[i].position[0] && 
        y == positions[i].position[2]) {
      return i;
    }
  }
  return -1;
}

function getPlatePosition(plateNo) {
  var positions = readPlateJson();
  return [positions[plateNo].position[0], positions[plateNo].position[2]];
}

function readPlateJson() {
    $.ajax({
    url:'/static/js/plates.json', 
    async: false,
    dataType: 'json',
    success: function(data) { 
      positions = data.object.children;
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
  });
  return positions;
}

function getBallPositions(balls_no) {
  var new_pos;
    //read new positions for required number of balls
  $.ajax({
    url:'/static/js/ball_positions.json', 
    async: false,
    dataType: 'json',
    success: function(data) { 
      new_pos = data.balls_no[balls_no-1];
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
  });
  return new_pos;
}

function getNextPlate(n) {
  return (n+1)%12;
}

function getBalls(plate_no) {
  return plates[plate_no].length;
}