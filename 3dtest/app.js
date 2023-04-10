var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;


// import trhee.js
import * as THREE from 'https://threejs.org/build/three.module.js';

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xe8e7cc, 1);
document.body.appendChild(renderer.domElement);
var cubes=[];
// create variable gfa with value from slider gfa
var gfa =(10 + 40/2);
var ga = Math.max(1, Math.min(80, 45))/10;

var scene = new THREE.Scene();

{
  const color = 0xFFFFFF;
  const intensity = 1.1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(ambientLight);


}
var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);

// add shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


scene.add(camera);

var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
var basicMaterial = new THREE.MeshPhongMaterial({color: 0x005C53});
// create cubes grid 20 x 20
for (var i = -5; i < 5; i++) {
  for (var j = -5; j < 5; j++) {
    var cube = new THREE.Mesh(boxGeometry, basicMaterial);
    cube.position.x = i*10;
    cube.position.y = 0.5;
    cube.position.z = j*10;
    cube.scale.x = 10-ga;
    cube.scale.z = 10-ga;
    cube.scale.y = gfa /(10-ga) ;
    cube.castShadow = true; //default is false
    scene.add(cube);
    cubes.push(cube);
  }
}
var greenMaterial = new THREE.MeshPhongMaterial({color: 0x9FC131});
var cube = new THREE.Mesh(boxGeometry, greenMaterial );
cube.position.x = -5;
cube.position.y = -gfa /(10-ga)/2;
cube.position.z = -5;
cube.scale.x = 100;
cube.scale.z = 100;
cube.scale.y = 1 ;

// add shadow
cube.castShadow = true; //default is false
cube.receiveShadow = true; //default

scene.add(cube);
//cube.rotation.set(0.4, 0.2, 0);

function render() {
  // get time
  var time = new Date().getTime();
  time *= 0.0001;  // convert time to seconds
 
// make camera rotating around the scene
  camera.position.x = Math.cos(time) * 100;
  camera.position.z = Math.sin(time) * 100;
  camera.position.y =  50;
  camera.lookAt(0, -18, 0);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

//Listen to range "gfa"
document.getElementById("gfa").addEventListener("input", function() { 

  gfa = 10 + this.value/2;
  var size = 10-ga;
  var height = gfa /(10-ga);
 // itirate through cubes array
  for (var i = 0; i < cubes.length; i++) {
    // scale cubes
    cube.position.y = -gfa /(10-ga)/2;
    cubes[i].scale.x = size;
    cubes[i].scale.z = size;
    cubes[i].scale.y = height ;
  }
});
document.getElementById("ga").addEventListener("input", function() { 

  // clamping this.value to 1-9
  ga = Math.max(1, Math.min(80, this.value))/10;
  var size = 10-ga;
  var height = gfa /(10-ga);

  for (var i = 0; i < cubes.length; i++) {
    // scale cubes
    cube.position.y = -gfa /(10-ga)/2;
    cubes[i].scale.x = size;
    cubes[i].scale.z = size;
    cubes[i].scale.y = height ;
  }
});