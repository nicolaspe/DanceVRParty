/* Dance VR Party
*
*	Music Science Hackathon - Feb 02, 2018
*		Nouf Aljowaysir
* 		Aarón Montoya-Moraga
* 			Nicolás Peña-Escarpentier
*/

// global threejs variables
let container, renderer, camera, scene;
let controls, loader, effect;
let pointLight, pointLight2;

window.addEventListener('load', onLoad);

function onLoad(){
	container = document.querySelector('#sketch');
	let wid = window.innerWidth;
	let hei = window.innerHeight;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x222222 );
	camera = new THREE.PerspectiveCamera(100, wid/hei, 0.1, 1000);

	dollyCam = new THREE.PerspectiveCamera();
	dollyCam.add(camera);
	scene.add(dollyCam);

	dollyCam.position.set(0, -10, 20);
	//dollyCam.target.set(0, -10, 0);
	//camera.target.set(0,-10,0);

	effect = new THREE.VREffect(renderer);
  effect.setSize(wid, hei);

	controls = new THREE.VRControls( camera );
  controls.standing = true;
  camera.position.y = controls.userHeight;
	controls.update();

	loader = new THREE.TextureLoader();
	createEnvironment();

	// Initialize (Web)VR
  renderer.vr.enabled = true;
  setupVRStage();

	window.addEventListener('resize', onWindowResize, true );
	window.addEventListener('vrdisplaypresentchange', onWindowResize, true);
}

// sets up the VR stage + button
function setupVRStage(){
  // get available displays
  navigator.getVRDisplays().then( function(displays){
    if(displays.length > 0) {
			// console.log(displays);
      vrDisplay = displays[0];
      // setup button
      vrButton = WEBVR.getButton( vrDisplay, renderer.domElement );
      document.getElementById('vr_button').appendChild( vrButton );
    } else {
      console.log("NO VR DISPLAYS PRESENT");
    }
    update();
  });
}

// EVENTS
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

	effect.setSize(wid, hei);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}


// ANIMATION
function update(){
	window.requestAnimationFrame(animate);
}
function animate(timestamp) {
	let time = performance.now() * 0.009;
	pointLight.position.x = Math.sin( time * 0.6 ) * 15;
	pointLight.position.y = Math.sin( time * 0.7 ) * 15 + 5;
	pointLight.position.z = Math.sin( time * 0.8 ) * 15;
	pointLight.rotation.x = time;
	pointLight.rotation.z = time;
	time += 10000;

	pointLight2.position.x = Math.sin( time * 0.6 ) * 9;
	pointLight2.position.y = Math.sin( time * 0.7 ) * 9 + 5;
	pointLight2.position.z = Math.sin( time * 0.8 ) * 9;
	pointLight2.rotation.x = time;
	pointLight2.rotation.z = time;

  if(vrDisplay.isPresenting){ // VR rendering
    controls.update();
    effect.render(scene, camera);
    vrDisplay.requestAnimationFrame(animate);
  } else {  // browser rendering
		controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }
}


// ENVIRONMENT
function createEnvironment(){
	// SKYDOME
	let sky_geo = new THREE.SphereGeometry(600, 24, 24);
	let sky_mat = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		wireframe: true,
	});
	var skydome = new THREE.Mesh(sky_geo, sky_mat);
	scene.add(skydome)

	// SPHERES
	// let sp_geo  = new THREE.SphereGeometry(20, 12, 12);
	// let sp_mat1 = new THREE.MeshBasicMaterial({
	// 	color: 0x0000ff,
	// 	side: THREE.DoubleSide,
	// });
	// let sp_mat2 = new THREE.MeshLambertMaterial({
	// 	color: 0x00ff00,
	// 	side: THREE.DoubleSide,
	// })
  //
	// var sphere1 = new THREE.Mesh(sp_geo, sp_mat1);
	// sphere1.position.set(-200, 0, 0);
	//scene.add(sphere1);

	let geometry = new THREE.BoxGeometry( 100, 100, 100 );
	let boxMaterial = new THREE.MeshPhongMaterial( {
					color: 0xa0adaf,
					shininess: 10,
					specular: 0x111111,
					side: THREE.DoubleSide
				} );
	let cube = new THREE.Mesh( geometry, boxMaterial );
	cube.receiveShadow = true;
	scene.add( cube );

	// var sphere2 = new THREE.Mesh(sp_geo, sp_mat2);
	// sphere2.position.set(0, 0, -200);
	// scene.add(sphere2);


	// LIGHTS!
	// scene.add( new THREE.AmbientLight( 0x3572B0) );
	// let d_light = new THREE.DirectionalLight(0xffffff, 1);
	// d_light.position =
	// scene.add(d_light);

	pointLight = new THREE.PointLight(0xff0000, 1.5, 1000, 10);
	pointLight.position.set(0, 0, 0);
	let lightGeo1 = new THREE.SphereGeometry( 0.5, 50, 50 );
	let lightMat1 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh1 = new THREE.Mesh( lightGeo1, lightMat1 );
	lightMesh1.castShadow = true;
	lightMesh1.receiveShadow = true;
	//pointLight.add( lightMesh1 );

	scene.add(pointLight);

	pointLight2 = new THREE.PointLight(0x0000D0, 1.5, 1000, 10);
	pointLight2.position.set(0, 0, 0);
	let lightGeo2 = new THREE.SphereGeometry( 0.5, 50, 50 );
	let lightMat2 = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	let lightMesh2 = new THREE.Mesh( lightGeo2, lightMat2 );
	lightMesh2.castShadow = true;
	lightMesh2.receiveShadow = true;
	//pointLight2.add( lightMesh2 );

	scene.add(pointLight2);



}
