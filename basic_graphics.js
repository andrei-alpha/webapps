function makePointLight() {
      var point = new THREE.PointLight(0xffffff);
      point.position.x = 100;
      point.position.y = 100;
      point.position.z = 500;
      return point;
    }

function makeCamera() {
  var camera;
  $.ajax({
    url:'camera.json', 
    async: false,
    dataType: 'json',
    success: function(data) { 
        var view_angle = data.object.fov;
        var aspect = data.object.aspect;
        var near = data.object.near;
        var far = data.object.far;
        if (data.object.type == "PerspectiveCamera") {
          camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
        }
        camera.position.x = data.object.position[0];
        camera.position.y = data.object.position[1];
        camera.position.z = data.object.position[2];
        camera.rotation.x = data.object.rotation[0];
        camera.rotation.y = data.object.rotation[1];
        camera.rotation.z = data.object.rotation[2];
      }
    });
  return camera;
}

function makePlate(geometry, material, position) {
  var geometry = new THREE.CubeGeometry(geometry.width, geometry.height,
    geometry.depth);
  var material = new THREE.MeshLambertMaterial({color: 0x9E550B});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position.position[0];
  mesh.position.y = position.position[1];
  mesh.position.z = position.position[2];
  return mesh;
}

function getClickedObjects(event) {
  event.preventDefault();
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) 
    * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
  projector.unprojectVector( vector, camera );
  var raycaster = new THREE.Raycaster(camera.position, 
    vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(objects);
  return intersects;
}


function animate(){
  
}

function update(){
  renderer.render(scene, camera);
}


function onMouseMove(event) {
  mouseX = event.clientX - window.innerWidth/2;
  mouseY = event.clientY - window.innerHeight/2;
}

function onMouseDown(event) {
  var intersects = getClickedObjects(event);
  if (intersects.length > 0) {
    var clicked = intersects[0].object;
    if (clicked.name == "b") {
      sphere.rotation.y += 50;
    }
  }
}


