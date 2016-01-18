// 正交投影的缩放、平移、旋转控制
THREE.OrthographicControl = function (obj) {
	if (obj) {
		this._OrthographicControl (obj);
	}
};
THREE.OrthographicControl.prototype = new MouseDropController();
THREE.OrthographicControl.prototype.type = "THREE.OrthographicControl";
THREE.OrthographicControl.prototype._OrthographicControl = function (obj) {
	this._MouseDropController(obj.ctrlDom);
/*
	参数说明：
	{
		obj.ctrlDom,				// 控制对象
		obj.camera,				// 相机
		obj.light,				// 光源（数组）
		obj.center:{x, y, z}			// 旋转中心
	}
*/

	// 照相机
	this.camera = obj.camera;

	// 光源
	if (obj.light) {
		if (Lzrut.getClassType(obj.light) == "Array") {
			this.lights = obj.light;
		} else {
			this.lights = [obj.light];
		}
	} else {
		this.lights = [];
	}

	// 旋转中心
	if (obj.center) {
		this.center = new THREE.Vector3(obj.center.x, obj.center.y, obj.center.z);
	} else {
		this.center = new THREE.Vector3(0, 0, 0);
	}

	// 缩放比例
	this.zoomScale = 0.1;

	// 平移比例
	this.moveScale = 1;

	// 旋转比例
	this.rotateScale = 3;

	// 重置信息
	this.resetter = {
		x: null,
		y: null,
		z: null,
		position: null,
		up: null,
		zoom: 0,
		lights: Lzrut.clone(this.lights)
	};

	// 旋转刚体
	this.rigid = {
		x: new THREE.Vector3(1, 0, 0),
		y: new THREE.Vector3(0, 1, 0),
		z: new THREE.Vector3(0, 0, -1),
		look: this.center.clone(),
		position: this.camera.position.clone(),
/*
// 测试坐标
m: new THREE.Vector3(1, 1, 0),
n: new THREE.Vector3(0, -1, 1)
*/
	};

	// 坐标旋转
	this.cc = null;

	// 镜距（用于透视的平移比例）
	this.distance = 1;

	// 球面
	this.ball = null;

	this.init(obj);
};

// 初始化
THREE.OrthographicControl.prototype.init = function(obj) {
	this.initCamera();
};

// 初始化相机位置
THREE.OrthographicControl.prototype.initCamera = function() {
	this.camera.position.set(0, 0, 0);
	this.camera.up.copy(this.rigid.y);
	this.camera.lookAt(this.rigid.z);
	this.camera.position.copy(this.rigid.position);

	// 相机瞄准之刚体换算
	var p = this.center.clone().sub(this.rigid.position);
	this.distance = p.length();
	var z = new THREE.Vector3(0, 0, -this.distance);
	var angle = Math.acos( z.dot( p ) / z.length() / this.distance);
	if (angle) {
		var axis = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		axis.crossVectors( z, p ).normalize();
		quaternion.setFromAxisAngle( axis, angle );
		this.rigid.x.applyQuaternion( quaternion );
		this.rigid.y.applyQuaternion( quaternion );
		this.rigid.z.applyQuaternion( quaternion );
/*
// 测试坐标
this.rigid.m.applyQuaternion( quaternion );
this.rigid.n.applyQuaternion( quaternion );
*/
		this.camera.up.copy(this.rigid.y);
	}
	this.rigid.x.add(this.rigid.position);
	this.rigid.y.add(this.rigid.position);
	this.rigid.z.add(this.rigid.position);
/*
// 测试坐标
this.rigid.m.add(this.rigid.position);
this.rigid.n.add(this.rigid.position);
*/
	this.camera.lookAt(this.rigid.look);

	// 保存重置信息
	this.resetter.position = this.camera.position.clone();
	this.resetter.up = this.camera.up.clone();
	this.resetter.x = this.rigid.x.clone();
	this.resetter.y = this.rigid.y.clone();
	this.resetter.z = this.rigid.z.clone();
	if (this.camera.type == "OrthographicCamera") {
		this.resetter.zoom = this.camera.zoom;
	}
/*
// 测试用，显示换算结果。
log(	"position : " + this.rigid.position.x + " , " + this.rigid.position.y + " , " + this.rigid.position.z + "\n" +
	"camera : " + this.camera.position.x + " , " + this.camera.position.y + " , " + this.camera.position.z + "\n" +
	"x : " + this.rigid.x.x + " , " + this.rigid.x.y + " , " + this.rigid.x.z + "\n" +
	"y : " + this.rigid.y.x + " , " + this.rigid.y.y + " , " + this.rigid.y.z + "\n" +
	"z : " + this.rigid.z.x + " , " + this.rigid.z.y + " , " + this.rigid.z.z + "\n");
	// "m : " + this.rigid.m.x + " , " + this.rigid.m.y + " , " + this.rigid.m.z + "\n" +	// 测试坐标 M 点
	// "n : " + this.rigid.n.x + " , " + this.rigid.n.y + " , " + this.rigid.n.z);		// 测试坐标 N 点
*/
};

// 缩放相机
THREE.OrthographicControl.prototype.zoom = function () {
	// 计算缩放比例
	var zs = (this.midStart.y - this.midEnd.y)/10 + this.wheelValue;

	if (zs) {
		// 恢复鼠标位置
		this.wheelValue = 0;
		this.midStart = Lzrut.clone(this.midEnd);

		if (this.camera.type == "OrthographicCamera") {
			// 比例换算
			if (zs>0) {
				zs = 1.0 + zs*this.zoomScale;
			} else {
				zs = 1.0 / (1.0 - zs*this.zoomScale);
			}

			// 设置缩放参数
			this.camera.zoom *= zs;
			this.camera.updateProjectionMatrix();
		} else {
			// 比例换算
			zs *= -1;
			if (zs>0) {
				zs = 1.0 + zs*this.zoomScale;
			} else {
				zs = 1.0 / (1.0 - zs*this.zoomScale);
			}

			// 透视投影缩放时的相机移动
			this.rigid.look.sub(this.center).multiplyScalar(zs).add(this.center);
			var s = this.rigid.position.clone();
			s.sub(this.center).multiplyScalar(zs).add(this.center).sub(this.rigid.position);
			this.rigid.position.add(s);
			this.rigid.x.add(s);
			this.rigid.y.add(s);
			this.rigid.z.add(s);
			this.camera.position.copy(this.rigid.position);
			//this.camera.lookAt(this.rigid.look);

			// 更新镜距
			this.distance = this.rigid.position.distanceTo(this.rigid.look);

			// 清空原相机位置的坐标旋转参数
			if (this.cc) {
				delete(this.cc);
				this.cc = null;
			}
		}
	}
};

// 平移相机
THREE.OrthographicControl.prototype.pan = function () {
	var x = this.rightStart.x - this.rightEnd.x;
	var y = this.rightEnd.y - this.rightStart.y;
	if (x || y) {
		// 比例换算
		var s = new THREE.Vector3(x, y, 0), z;
		if (this.camera.type == "OrthographicCamera") {
			s.multiplyScalar(this.moveScale/this.camera.zoom);
		} else {
			s.multiplyScalar(this.moveScale*this.distance/360);
		}

		// 向量旋转
		if (!this.cc) {
			this.cc = new CoordinateChange({
				s: {		// 相机坐标系
					p1: {x:0, y:0, z:0},
					p2: {x:1, y:0, z:0},
					p3: {x:0, y:1, z:0},
					p4: {x:0, y:0, z:-1},
				},
				t: {		// 场景坐标系
					p1: this.rigid.position,
					p2: this.rigid.x,
					p3: this.rigid.y,
					p4: this.rigid.z,
				},
				scale: 1
			});
			this.cc.computeR4 ();
			this.cc.p = this.rigid.position.clone();
		}
		this.cc.trans(s, s);
		s.sub(this.cc.p);

		// 刚体平移
		this.rigid.position.add(s);
		this.rigid.look.add(s);
		this.rigid.x.add(s);
		this.rigid.y.add(s);
		this.rigid.z.add(s);

		this.camera.position.copy(this.rigid.position);
		//this.camera.lookAt(this.rigid.look);

		// 恢复鼠标位置
		this.rightStart = Lzrut.clone(this.rightEnd);
	}
};

// 旋转相机
THREE.OrthographicControl.prototype.rotate = function () {
	if (!this.ball) {
		this.ball = Lzrut.getDomPositionForDocument(this.ctrlDom);
	}
	if ((this.leftStart.x - this.leftEnd.x) || (this.leftEnd.y - this.leftStart.y)) {
		// 生成旋转向量
		var start = this.getCoordinateOnBall(this.leftEnd);
		var end = this.getCoordinateOnBall(this.leftStart);

		// 计算夹角
		var angle = Math.acos( start.dot(end) / start.length() / end.length());
		if (angle) {
			var axis = new THREE.Vector3();
			var quaternion = new THREE.Quaternion();

			// 计算旋转轴
			axis.crossVectors(start, end).normalize();
			if (!this.cc) {
				this.cc = new CoordinateChange({
					s: {
						p1: {x:0, y:0, z:0},
						p2: {x:1, y:0, z:0},
						p3: {x:0, y:1, z:0},
						p4: {x:0, y:0, z:-1},
					},
					t: {
						p1: this.rigid.position,
						p2: this.rigid.x,
						p3: this.rigid.y,
						p4: this.rigid.z,
					},
					scale: 1
				});
				this.cc.computeR4 ();
				this.cc.p = this.rigid.position.clone();
			}
			this.cc.trans(axis, axis);
			axis.sub(this.cc.p).normalize();
/*
// 测试浮点运算的累计误差
// 结论：
// 1. 正交投影——平移：因镜距永不变，故平移误差无累计。
// 2. 正交投影——缩放：暂不消除 this.camera.zoom 的累计误差。暂不避免过小值。
// 3. 透视投影——平移：与正交相同，镜距相对稳定，有误差，但不累计。
// 4. 透视投影——缩放：刚体与镜距的误差暂不消除。暂不避免过小值。
// 5. 旋转：误差最大，必须消除。
log(	"（涉及旋转）axis.L : " + axis.length() + "\n" +
	"（涉及旋转、平移）rigid.position.L : " + this.rigid.position.distanceTo(this.rigid.look) + "\n" +
	"（涉及正交缩放）camera.zoom : " + this.camera.zoom + "\n" +
	"（涉及透视缩放）this.distance : " + this.distance + "\n"
);
*/

			// 计算旋转角度
			angle *= this.rotateScale;

			// 计算四元数
			quaternion.setFromAxisAngle(axis, angle);

			// 计算相对旋转中心的坐标
			for (end in this.rigid) {
				this.rigid[end].sub(this.center);
			}
			for (end in this.lights) {
				this.lights[end].position.sub(this.center);
			}
			//this.camera.up.sub(this.center);

			// 旋转
			for (end in this.rigid) {
				this.rigid[end].applyQuaternion( quaternion );
			}
			for (end in this.lights) {
				this.lights[end].position.applyQuaternion( quaternion );
			}
			this.camera.up.applyQuaternion( quaternion );

			// 计算相对主坐标的坐标
			for (end in this.rigid) {
				this.rigid[end].add(this.center);
			}
			for (end in this.lights) {
				this.lights[end].position.add(this.center);
			}
			//this.camera.up.add(this.center);

			// 移动相机至刚体
			this.camera.position.copy(this.rigid.position);
			this.camera.lookAt(this.rigid.look);

			// 重新计算坐标旋转参数
			delete(this.cc);
			this.cc = null;
			this.cc = new CoordinateChange({
				s: {
					p1: {x:0, y:0, z:0},
					p2: {x:1, y:0, z:0},
					p3: {x:0, y:1, z:0},
					p4: {x:0, y:0, z:-1},
				},
				t: {
					p1: this.rigid.position,
					p2: this.rigid.x,
					p3: this.rigid.y,
					p4: this.rigid.z,
				},
				scale: 1
			});
			this.cc.computeR4 ();
			this.cc.p = this.rigid.position.clone();
		}
			
		// 恢复鼠标位置
		this.leftStart = Lzrut.clone(this.leftEnd);
	}
};

// 换算球面坐标
THREE.OrthographicControl.prototype.getCoordinateOnBall = function (p) {
	var b = new THREE.Vector3 (
		(p.x - this.ball.left)/this.ball.width*2 - 1,	// x
		(this.ball.top - p.y)/this.ball.height*2 + 1,	//y
		0	// z
	);
	var length = b.length();
	if ( length < 1.0 ) {
		b.z = Math.sqrt( 1.0 - length * length );
	} else {
		b.normalize();
	}
	return b;
};

// 更新
THREE.OrthographicControl.prototype.update = function() {
	switch (this.state) {
		case this.STATE.LEFT:
			this.rotate();
			break;
		case this.STATE.MID:
			this.zoom();
			break;
		case this.STATE.RIGHT:
			this.pan();
			break;
		case this.STATE.NONE:
			this.zoom();
			//this.pan();
			//this.rotate();
			break;
	}
};

// 重置
THREE.OrthographicControl.prototype.reset = function() {
	this.camera.zoom = this.resetter.zoom;
	this.camera.up.copy(this.resetter.up);
	this.camera.position.copy(this.resetter.position);
	this.camera.lookAt(this.center);

	this.rigid.x.copy(this.resetter.x);
	this.rigid.y.copy(this.resetter.y);
	this.rigid.z.copy(this.resetter.z);
	this.rigid.look.copy(this.center);
	this.rigid.position.copy(this.resetter.position);

	var p;
	for (p in this.lights) {
		this.lights[p].position.copy(this.resetter.lights[p].position);
	}
};

// 自动刷新
THREE.OrthographicControl.prototype.autoFlush = function() {};
