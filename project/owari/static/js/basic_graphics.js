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