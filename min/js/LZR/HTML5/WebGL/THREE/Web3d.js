LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/expand/threejs/three.js",LZR.HTML5.jsPath+"HTML5/expand/threejs/OBJLoader.js",LZR.HTML5.jsPath+"HTML5/util/Util.js",LZR.HTML5.jsPath+"HTML5/WebGL/THREE/OrthographicControl.js"]);
LZR.HTML5.WebGL.Three.Web3d=function(a){this.canvas=null;this.height=this.width=0;this.renderer=null;this.backColor=a.backColor?a.backColor:13421772;this.near=0.01;this.far=1E5;this.mod=this.camera=this.scene=null;this.meshs={};this.controls=this.light=null;this.center=a.center?new THREE.Vector3(a.center.x,a.center.y,a.center.z):new THREE.Vector3(0,0,0);this.rotateId=0;this.testLine=[];this.init(a)};LZR.HTML5.WebGL.Three.Web3d.prototype.className="LZR.HTML5.WebGL.Three.Web3d";
LZR.HTML5.WebGL.Three.Web3d.prototype.version="0.0.3";
LZR.HTML5.WebGL.Three.Web3d.prototype.init=function(a){this.createRanderer(a);this.scene=new THREE.Scene;this.mod=new THREE.Object3D;this.scene.add(this.mod);a.fov?this.camera=new THREE.PerspectiveCamera(a.fov,this.width/this.height,this.near,this.far):(this.near=-this.far,this.camera=new THREE.OrthographicCamera(this.width/-2,this.width/2,this.height/2,this.height/-2,this.near,this.far),a.zoom&&(this.camera.zoom=a.zoom,this.camera.updateProjectionMatrix()));this.scene.add(this.camera);a.cameraPosition?
this.camera.position.set(a.cameraPosition.x,a.cameraPosition.y,a.cameraPosition.z):this.camera.position.set(0,0,1);var b=new THREE.AmbientLight(394758);this.scene.add(b);this.light=new THREE.DirectionalLight(16777215);this.light.position.copy(this.camera.position);this.scene.add(this.light);this.controls=new LZR.HTML5.WebGL.Three.OrthographicControl({ctrlDom:this.canvas,camera:this.camera,light:this.light,center:this.center});this.controls.enable();this.control();a.file&&this.load3D(a.file)};
LZR.HTML5.WebGL.Three.Web3d.prototype.createRanderer=function(a){a.canvas?(this.canvas=a.canvas,this.width=this.canvas.width,this.height=this.canvas.height,this.renderer=new THREE.WebGLRenderer({canvas:a.canvas})):(this.renderer=new THREE.WebGLRenderer,this.canvas=this.renderer.domElement,a.width&&a.height&&renderer.setSize(a.width,a.height),this.width=this.canvas.width,this.height=this.canvas.height);this.renderer.setClearColor(this.backColor)};
LZR.HTML5.WebGL.Three.Web3d.prototype.load3D=function(a){switch(LZR.HTML5.Util.getFileExtension(a)){case "obj":this.loadObj(a);break;default:this.loadJson(a)}};LZR.HTML5.WebGL.Three.Web3d.prototype.appendMesh=function(a,b){this.meshs[a]=b;this.mod.add(b);this.flush()};LZR.HTML5.WebGL.Three.Web3d.prototype.removeMesh=function(a){this.mod.remove(this.meshs[a]);this.flush()};
LZR.HTML5.WebGL.Three.Web3d.prototype.loadJson=function(a){(new THREE.JSONLoader).load(a,LZR.HTML5.Util.bind(this,function(b,d){for(var c=0;c<d.length;c++)d[c].side=THREE.DoubleSide;c=new THREE.MeshFaceMaterial(d);c=new THREE.Mesh(b,c);this.meshs[a]=c;this.mod.add(c);this.flush()}))};
LZR.HTML5.WebGL.Three.Web3d.prototype.loadObj=function(a){(new THREE.OBJLoader).load(a,LZR.HTML5.Util.bind(this,function(b){b.traverse(function(a){a instanceof THREE.Mesh&&(a.material.side=THREE.DoubleSide)});this.meshs[a]=b;this.mod.add(b);this.flush()}))};LZR.HTML5.WebGL.Three.Web3d.prototype.rotate=function(){this.rotateId=setInterval(LZR.HTML5,Util.bind(this,function(){this.mod.rotation.y+=0.01;this.mod.rotation.y>2*Math.PI&&(this.mod.rotation.y-=2*Math.PI);this.flush()}),20)};
LZR.HTML5.WebGL.Three.Web3d.prototype.stopRotate=function(){clearInterval(this.rotateId)};LZR.HTML5.WebGL.Three.Web3d.prototype.control=function(){requestAnimationFrame(LZR.HTML5.Util.bind(this,this.control));this.controls.update();this.flush()};
LZR.HTML5.WebGL.Three.Web3d.prototype.addSceneCoo=function(){if(!this.testLine.sceneX){var a=new THREE.Vector3(0,0,0);this.testLine.sceneX=this.line(a,new THREE.Vector3(1E4,0,0),16711680);this.testLine.sceneY=this.line(a,new THREE.Vector3(0,1E4,0),65280);this.testLine.sceneZ=this.line(a,new THREE.Vector3(0,0,1E4),255);this.scene.add(this.testLine.sceneX);this.scene.add(this.testLine.sceneY);this.scene.add(this.testLine.sceneZ)}};
LZR.HTML5.WebGL.Three.Web3d.prototype.delSceneCoo=function(){this.testLine.sceneX&&(this.scene.remove(this.testLine.sceneX),this.scene.remove(this.testLine.sceneY),this.scene.remove(this.testLine.sceneZ),LZR.HTML5.Util.del(this.testLine.sceneX),LZR.HTML5.Util.del(this.testLine.sceneY),LZR.HTML5.Util.del(this.testLine.sceneZ))};
LZR.HTML5.WebGL.Three.Web3d.prototype.addCenterCoo=function(){this.testLine.centerX||(this.testLine.centerX=this.line(this.center,(new THREE.Vector3(1E4,0,0)).add(this.center),16711680),this.testLine.centerY=this.line(this.center,(new THREE.Vector3(0,1E4,0)).add(this.center),65280),this.testLine.centerZ=this.line(this.center,(new THREE.Vector3(0,0,1E4)).add(this.center),255),this.scene.add(this.testLine.centerX),this.scene.add(this.testLine.centerY),this.scene.add(this.testLine.centerZ))};
LZR.HTML5.WebGL.Three.Web3d.prototype.delCenterCoo=function(){this.testLine.centerX&&(this.scene.remove(this.testLine.centerX),this.scene.remove(this.testLine.centerY),this.scene.remove(this.testLine.centerZ),LZR.HTML5.Util.del(this.testLine.centerX),LZR.HTML5.Util.del(this.testLine.centerY),LZR.HTML5.Util.del(this.testLine.centerZ))};
LZR.HTML5.WebGL.Three.Web3d.prototype.addCameraCoo=function(){this.testLine.camerarX||(this.testLine.camerarX=this.line(this.controls.rigid.look,this.controls.rigid.x,16711680),this.testLine.camerarY=this.line(this.controls.rigid.look,this.controls.rigid.y,65280),this.testLine.camerarZ=this.line(this.controls.rigid.look,this.controls.rigid.z,255),this.scene.add(this.testLine.camerarX),this.scene.add(this.testLine.camerarY),this.scene.add(this.testLine.camerarZ))};
LZR.HTML5.WebGL.Three.Web3d.prototype.delCameraCoo=function(){this.testLine.camerarX&&(this.scene.remove(this.testLine.camerarX),this.scene.remove(this.testLine.camerarY),this.scene.remove(this.testLine.camerarZ),LZR.HTML5.Util.del(this.testLine.camerarX),LZR.HTML5.Util.del(this.testLine.camerarY),LZR.HTML5.Util.del(this.testLine.camerarZ))};LZR.HTML5.WebGL.Three.Web3d.prototype.flush=function(){this.renderer.render(this.scene,this.camera)};
LZR.HTML5.WebGL.Three.Web3d.prototype.line=function(a,b,d){var c=new THREE.Geometry,d=new THREE.LineBasicMaterial({color:d});c.vertices.push(a);c.vertices.push(b);return new THREE.Line(c,d,THREE.LinePieces)};
