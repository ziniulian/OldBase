LZR.HTML5.loadJs([LZR.HTML5.jsPath+"util/expand/json2.js",LZR.HTML5.jsPath+"HTML5/expand/threejs/three.js",LZR.HTML5.jsPath+"util/Geography/Longitude.js",LZR.HTML5.jsPath+"util/Geography/Latitude.js"]);
LZR.HTML5.WebGL.Three.PositionFace=function(a){this.id=a.id;this.name=a.name;this.origin=a.origin;this.movs=a.movs;this.axis=a.axis;this.direction=a.direction;this.distance=a.distance;this.imgs=a.imgs;this.imgUrl=a.imgUrl;this.init();this.material=new THREE.MeshBasicMaterial({map:this.flush(),overdraw:!0,side:THREE.DoubleSide,transparent:!0,blending:THREE.NormalBlending,opacity:a.alpha})};LZR.HTML5.WebGL.Three.PositionFace.prototype.className="LZR.HTML5.WebGL.Three.PositionFace";
LZR.HTML5.WebGL.Three.PositionFace.prototype.version="0.0.1";
LZR.HTML5.WebGL.Three.PositionFace.prototype.init=function(){var a=new THREE.Face3(this.movs[0],this.movs[1],this.movs[2]);a.materialIndex=this.id;this.origin.geo.faces.push(a);this.origin.geo.faceVertexUvs[0].push([new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(0,1)]);a=new THREE.Face3(this.movs[1],this.movs[2],this.movs[3]);a.materialIndex=this.id;this.origin.geo.faces.push(a);this.origin.geo.faceVertexUvs[0].push([new THREE.Vector2(1,0),new THREE.Vector2(0,1),new THREE.Vector2(1,
1)])};LZR.HTML5.WebGL.Three.PositionFace.prototype.setDistance=function(a){a>this.origin.max?a=this.origin.max:a<this.origin.min&&(a=this.origin.min);if(this.distance!=a){this.distance=a;for(var c=this.origin.geo.vertices,d=this.origin[this.axis]+a*this.direction,b=0;b<this.movs.length;b++)c[this.movs[b]][this.axis]=d;this.flush()}return a};LZR.HTML5.WebGL.Three.PositionFace.prototype.flush=function(){var a=THREE.ImageUtils.loadTexture(this.imgUrl);this.material&&(this.material.map=a);return a};
LZR.HTML5.WebGL.Three.PositionFace.prototype.setAlpha=function(a){1<a?a=1:0>a&&(a=0);return this.material.opacity=a};
