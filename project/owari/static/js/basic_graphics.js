var ARROW_SHIFT_LENGTH = 250;

function makePointLight() {
      var point = new THREE.PointLight(0xffffff);
      point.position.x = 0;
      point.position.y = 300;
      point.position.z = 200;
      return point;
    }

function makeCamera() {
  var camera;
  var data = readJson('/static/js/camera.json');
  var view_angle = data.object.fov;
  //var aspect = data.object.aspect;
  var near = data.object.near;
  var far = data.object.far;
  camera = new THREE.PerspectiveCamera(view_angle, ASPECT, near, far);
  camera.position.x = data.object.position[0];
  camera.position.y = data.object.position[1];
  camera.position.z = data.object.position[2];
  camera.rotation.x = data.object.rotation[0];
  camera.rotation.y = data.object.rotation[1];
  camera.rotation.z = data.object.rotation[2];
  return camera;
}

function makePlate(geometry, position) {
  var geometry = new THREE.CubeGeometry(geometry.width, geometry.height,
    geometry.depth);
  var material = new THREE.MeshLambertMaterial({color: 0x9E550B});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position.position[0];
  mesh.position.y = position.position[1];
  mesh.position.z = position.position[2];
  scene.add(mesh);
  objects.push(mesh);
  return mesh;
}

function makeSphere(x, y, z) {
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random()
  });
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_RADIUS, 20, 20), 
    sphereMaterial 
  );
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  return sphere;
}

function makeArrow() {
  var positions = readJson('/static/js/arrow.json').arrow;
  var material = new THREE.MeshLambertMaterial({color: 0xffffff});
  var geometry_centre = new THREE.CubeGeometry(50, 5, 5);
  var geometry_right = new THREE.CubeGeometry(25, 5, 5);
  var geometry_left = new THREE.CubeGeometry(25, 5, 5);

  arrow[0] = new THREE.Mesh(geometry_centre, material);
  arrow[1] = new THREE.Mesh(geometry_right, material);
  arrow[2] = new THREE.Mesh(geometry_left, material);
  
  arrow[0].position.x = positions[0].position[0];
  arrow[0].position.y = positions[0].position[1];
  arrow[0].position.z = positions[0].position[2];

  arrow[1].position.x = positions[1].position[0];
  arrow[1].position.y = positions[1].position[1];
  arrow[1].position.z = positions[1].position[2];

  arrow[2].position.x = positions[2].position[0];
  arrow[2].position.y = positions[2].position[1];
  arrow[2].position.z = positions[2].position[2];

  arrow[1].rotation.y = positions[1].rotation[1];
  arrow[2].rotation.y = positions[2].rotation[1];
  

  for (var i = 0; i < arrow.length; i++) {
    scene.add(arrow[i]);
  }

  return arrow;
}

function readJson(filename) {
  var filedata;
  $.ajax({
    url:filename, 
    async: false,
    dataType: 'json',
    success: function(data) { 
      filedata = data;
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
  });
  return filedata;
}