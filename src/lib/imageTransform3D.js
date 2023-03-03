////////////////////////////////////////////////////////////
// ============= micro HTML5 library =====================
// @author Gerard Ferrandez / http://www.dhteumeuleu.com/
// last update: May 27, 2013
// Released under the MIT license
// http://www.dhteumeuleu.com/LICENSE.html
////////////////////////////////////////////////////////////

// ===== ge1doot global =====

var ge1doot = ge1doot || {
	json: null,
	screen: null,
	pointer: null,
	camera: null,
	loadJS: function (url, callback, data) {
		if (typeof url == "string") url = [url];
		var load = function (src) {
			var script = document.createElement("script");
				if (callback) {
					if (script.readyState){
						script.onreadystatechange = function () {
							if (script.readyState == "loaded" || script.readyState == "complete"){
								script.onreadystatechange = null;
								if (--n === 0) callback(data || false);
							}
						}
					} else {
						script.onload = function() {
							if (--n === 0) callback(data || false);
						}
					}
				}
				script.src = src;
				document.getElementsByTagName("head")[0].appendChild(script);
		}
		for (var i = 0, n = url.length; i < n; i++) load(url[i]);
	}
}

// ===== html/canvas container =====

ge1doot.Screen = function (setup) {
	ge1doot.screen = this;
	this.elem = document.getElementById(setup.container) || setup.container;
	this.ctx = this.elem.tagName == "CANVAS" ? this.elem.getContext("2d") : false;
	this.style = this.elem.style;
	this.left = 0;
	this.top = 0;
	this.width = 0;
	this.height = 0;
	this.cursor = "default";
	this.setup = setup;
	this.resize = function () {
		var o = this.elem;
		this.width  = o.offsetWidth;
		this.height = o.offsetHeight;
		for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
			this.left += o.offsetLeft;
			this.top  += o.offsetTop;
		}
		if (this.ctx) {
			this.elem.width  = this.width;
			this.elem.height = this.height;
		}
		this.setup.resize && this.setup.resize();
	}
	this.setCursor = function (type) {
		if (type !== this.cursor && 'ontouchstart' in window === false) {
			this.cursor = type;
			this.style.cursor = type;
		}
	}
	window.addEventListener('resize', function () {
		ge1doot.screen.resize();
	}, false);
	!this.setup.resize && this.resize();
}

// ==== unified touch events handler ====

ge1doot.Pointer = function (setup) {
	ge1doot.pointer = this;
	var self        = this;
	var body        = document.body;
	var html        = document.documentElement;
	this.setup      = setup;
	this.screen     = ge1doot.screen;
	this.elem       = this.screen.elem;
	this.X          = 0;
	this.Y          = 0;
	this.Xi         = 0;
	this.Yi         = 0;
	this.bXi        = 0;
	this.bYi        = 0;
	this.Xr         = 0;
	this.Yr         = 0;
	this.startX     = 0;
	this.startY     = 0;
	this.scale      = 0;
	this.wheelDelta = 0;
	this.isDraging  = false;
	this.hasMoved   = false;
	this.isDown     = false;
	this.evt        = false;
	var sX          = 0;
	var sY          = 0;
	// prevent default behavior
	if (setup.tap) this.elem.onclick = function () { return false; }
	if (!setup.documentMove) {
		document.ontouchmove = function(e) { e.preventDefault(); }
	}
	document.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
	if (typeof this.elem.style.msTouchAction != 'undefined') this.elem.style.msTouchAction = "none";

	this.pointerDown = function (e) {
		if (!this.isDown) {
			if (this.elem.setCapture) this.elem.setCapture();
			this.isDraging = false;
			this.hasMoved = false;
			this.isDown = true;
			this.evt = e;
			this.Xr = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
			this.Yr = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY);
			this.X  = sX = this.Xr - this.screen.left;
			this.Y  = sY = this.Yr - this.screen.top + ((html && html.scrollTop) || body.scrollTop);
			this.setup.down && this.setup.down(e);
		}
	}
	this.pointerMove = function(e) {
		this.Xr = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
		this.Yr = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY);
		this.X  = this.Xr - this.screen.left;
		this.Y  = this.Yr - this.screen.top + ((html && html.scrollTop) || body.scrollTop);
		if (this.isDown) {
			this.Xi = this.bXi + (this.X - sX);
			this.Yi = this.bYi - (this.Y - sY);
		}
		if (Math.abs(this.X - sX) > 11 || Math.abs(this.Y - sY) > 11) {
			this.hasMoved = true;
			if (this.isDown) {
				if (!this.isDraging) {
					this.startX = sX;
					this.startY = sY;
					this.setup.startDrag && this.setup.startDrag(e);
					this.isDraging = true;
				} else {
					this.setup.drag && this.setup.drag(e);
				}
			} else {
				sX = this.X;
				sY = this.Y;
			}
		}
		this.setup.move && this.setup.move(e);
	}
	this.pointerUp = function(e) {
		this.bXi = this.Xi;
		this.bYi = this.Yi;
		if (!this.hasMoved) {
			this.X = sX;
			this.Y = sY;
			this.setup.tap && this.setup.tap(this.evt);
		} else {
			this.setup.up && this.setup.up(this.evt);
		}
		this.isDraging = false;
		this.isDown = false;
		this.hasMoved = false;
		this.setup.up && this.setup.up(this.evt);
		if (this.elem.releaseCapture) this.elem.releaseCapture();
		this.evt = false;
	}
	this.pointerCancel = function(e) {
		if (this.elem.releaseCapture) this.elem.releaseCapture();
		this.isDraging = false;
		this.hasMoved = false;
		this.isDown = false;
		this.bXi = this.Xi;
		this.bYi = this.Yi;
		sX = 0;
		sY = 0;
	}
	if ('ontouchstart' in window) {
		this.elem.ontouchstart      = function (e) { self.pointerDown(e); return false;  }
		this.elem.ontouchmove       = function (e) { self.pointerMove(e); return false;  }
		this.elem.ontouchend        = function (e) { self.pointerUp(e); return false;    }
		this.elem.ontouchcancel     = function (e) { self.pointerCancel(e); return false;}
	}
	document.addEventListener("mousedown", function (e) {
		if (
			e.target === self.elem || 
			(e.target.parentNode && e.target.parentNode === self.elem) || 
			(e.target.parentNode.parentNode && e.target.parentNode.parentNode === self.elem)
		) {
			if (typeof e.stopPropagation != "undefined") {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
			e.preventDefault();
			self.pointerDown(e); 
		}
	}, false);
	document.addEventListener("mousemove", function (e) { self.pointerMove(e); }, false);
	document.addEventListener("mouseup",   function (e) {
		self.pointerUp(e);
	}, false);
	document.addEventListener('gesturechange', function(e) {
		e.preventDefault();
		if (e.scale > 1) self.scale = 0.1; else if (e.scale < 1) self.scale = -0.1; else self.scale = 0;
		self.setup.scale && self.setup.scale(e);
		return false;
	}, false);
	if (window.navigator.msPointerEnabled) {
		var nContact = 0;
		var myGesture = new window.MSGesture();
		myGesture.target = this.elem;
		this.elem.addEventListener("MSPointerDown", function(e) {
			if (e.pointerType == e.MSPOINTER_TYPE_TOUCH) {
				myGesture.addPointer(e.pointerId);
				nContact++;
			}
		}, false);
		this.elem.addEventListener("MSPointerOut", function(e) {
			if (e.pointerType == e.MSPOINTER_TYPE_TOUCH) {
				nContact--;
			}
		}, false);
		this.elem.addEventListener("MSGestureHold", function(e) {
			e.preventDefault();
		}, false);
		this.elem.addEventListener("MSGestureChange", function(e) {
			if (nContact > 1) {
				if (e.preventDefault) e.preventDefault(); 
				self.scale = e.velocityExpansion;
				self.setup.scale && self.setup.scale(e);
			}
			return false;
		}, false);
	}
	if (window.addEventListener) this.elem.addEventListener('DOMMouseScroll', function(e) { 
		if (e.preventDefault) e.preventDefault(); 
		self.wheelDelta = e.detail * 10;
		self.setup.wheel && self.setup.wheel(e);
		return false; 
	}, false); 
	this.elem.onmousewheel = function (e) { 
		self.wheelDelta = -e.wheelDelta * .25;
		self.setup.wheel && self.setup.wheel(e);
		return false; 
	}
}

// ge1doot.transform3D
ge1doot.transform3D = {};

/* ==== draw Poly ==== */
ge1doot.transform3D.drawPoly = function () {
	this.ctx.beginPath();
	this.ctx.moveTo(this.points[0].X, this.points[0].Y);
	this.ctx.lineTo(this.points[1].X, this.points[1].Y);
	this.ctx.lineTo(this.points[2].X, this.points[2].Y);
	this.ctx.lineTo(this.points[3].X, this.points[3].Y);
	this.ctx.closePath();
}
/* =============== camera constructor ================= */
ge1doot.transform3D.Camera = function (setup, func) {
	ge1doot.camera = this;
	this.x  = 0;
	this.y  = 0;
	this.z  = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	this.focalLength     = setup.focalLength || 500;
	this.easeTranslation = setup.easeTranslation || 0.1;
	this.easeRotation    = setup.easeRotation || 0.025;
	this.enableRx        = setup.disableRx ? false : true;
	this.enableRy        = setup.disableRy ? false : true;
	this.enableRz        = setup.disableRz ? false : true;
	this.cmov = false;
	this.cosX = 1;
	this.sinX = 0;
	this.cosY = 1;
	this.sinY = 0;
	this.cosZ = 1;
	this.sinZ = 0;
	this.target = {
		over: false,
		elem: false,
		x:  0,
		y:  0,
		z:  0,
		rx: 0,
		ry: 0,
		rz: 0
	};
	// ---- def custom move ----
	if (func && func.move) this.cmov = func.move;
}
/* ==== easing ==== */
ge1doot.transform3D.Camera.prototype.ease = function (target, value) {
	while (Math.abs(target - value) > Math.PI) {
		if (target < value)  value -= 2 * Math.PI;
		else value += 2 * Math.PI;
	}
	return (target - value) * this.easeRotation;
}
/* ==== move / rotate camera ==== */
ge1doot.transform3D.Camera.prototype.move = function () {
	// ---- run custom function ----
	this.cmov && this.cmov();
	// ---- translations ----
	this.x += (this.target.x - this.x) * this.easeTranslation;
	this.y += (this.target.y - this.y) * this.easeTranslation;
	this.z += (this.target.z - this.z) * this.easeTranslation;
	// ---- rotation rx ----
	if (this.enableRx) {
		this.rx += this.ease(this.target.rx, this.rx);
		this.cosX = Math.cos(this.rx);
		this.sinX = Math.sin(this.rx);
	}
	// ---- rotation ry ----
	if (this.enableRy) {
		this.ry += this.ease(this.target.ry, this.ry);
		this.cosY = Math.cos(this.ry);
		this.sinY = Math.sin(this.ry);
	}
	// ---- rotation rz ----
	if (this.enableRz) {
		this.rz += this.ease(this.target.rz, this.rz);
		this.cosZ = Math.cos(this.rz);
		this.sinZ = Math.sin(this.rz);
	}
}
/* =============== point constructor ================= */
ge1doot.transform3D.Point = function (x, y, z, tx, ty) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.tx = tx || 0;
	this.ty = ty || 0;
	this.visible = false;
	this.scale = 0;
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.next = true;
}
/* ==== perspective projection ==== */
ge1doot.transform3D.Point.prototype.projection = function () {
	var sw       = this.scr.width  >> 1;
	var sh       = this.scr.height >> 1;
	// ---- 3D coordinates ----
	var nx       = this.x - this.camera.x;
	var ny       = this.y - this.camera.y;
	var nz       = this.z - this.camera.z;
	// ---- 3D rotation and projection ----
	if (this.camera.enableRz) {
		var u = this.camera.sinZ * ny + this.camera.cosZ * nx;
		var t = this.camera.cosZ * ny - this.camera.sinZ * nx;
	} else {
		var u = nx;
		var t = ny;
	}
	var s        = this.camera.cosY * nz + this.camera.sinY * u;
	this.Z       = this.camera.cosX * s  - this.camera.sinX * t;
	this.scale   = this.camera.focalLength / Math.max(1, this.Z);
	this.X       = sw + (this.camera.cosY * u  - this.camera.sinY * nz) * this.scale;
	this.Y       = -(this.camera.y >> 1) + sh - (this.camera.sinX * s  + this.camera.cosX * t) * this.scale;
	// ---- visibility test ----
	this.visible = (
		this.X > -sw * 0.5 && this.X < sw * 2.5
	) && (
		this.Y > -sh * 0.5 && this.Y < sh * 2.5
	);
	// ----return next (fast loop) ----
	return this.next;
}
/* ==== triangle constructor ==== */
ge1doot.transform3D.Triangle = function (parent, p0, p1, p2) {
	this.ctx = parent.ctx;
	this.texture = parent.texture;
	this.p0  = p0;
	this.p1  = p1;
	this.p2  = p2;
	this.d   = p0.tx * (p2.ty - p1.ty) - p1.tx * p2.ty + p2.tx * p1.ty + (p1.tx - p2.tx) * p0.ty;
	this.pmy = p1.ty - p2.ty;
	this.pmx = p1.tx - p2.tx;
	this.pxy = p2.tx * p1.ty - p1.tx * p2.ty;
	if (parent.t) parent.t.next = true;
}
/* ==== draw triangle ==== */
ge1doot.transform3D.Triangle.prototype.draw = function () {
	if (this.p0.visible || this.p1.visible || this.p2.visible) {
		var dx, dy, d;
		// ---- centroid ----
		var xc = (this.p0.X + this.p1.X + this.p2.X) / 3;
		var yc = (this.p0.Y + this.p1.Y + this.p2.Y) / 3;
		// ---- clipping ----
		this.ctx.save();
		this.ctx.beginPath();
		dx = xc - this.p0.X;
		dy = yc - this.p0.Y;
		d = Math.max(Math.abs(dx), Math.abs(dy));
		this.ctx.moveTo(this.p0.X - 2 * (dx / d), this.p0.Y - 2 * (dy / d));
		dx = xc - this.p1.X;
		dy = yc - this.p1.Y;
		d = Math.max(Math.abs(dx), Math.abs(dy));
		this.ctx.lineTo(this.p1.X - 2 * (dx / d), this.p1.Y - 2 * (dy / d));
		dx = xc - this.p2.X;
		dy = yc - this.p2.Y;
		d = Math.max(Math.abs(dx), Math.abs(dy));
		this.ctx.lineTo(this.p2.X - 2 * (dx / d), this.p2.Y - 2 * (dy / d));
		this.ctx.closePath();
		this.ctx.clip();
		// ---- transform ----
		var t0 = this.p2.X  - this.p1.X,
			t1 = this.p1.Y  - this.p2.Y,
			t2 = this.p2.ty * this.p1.X,
			t3 = this.p1.tx * this.p2.X,
			t4 = this.p2.ty * this.p1.Y,
			t5 = this.p1.ty * this.p2.X,
			t6 = this.p1.ty * this.p2.Y,
			t7 = this.p2.tx * this.p1.X,
			t8 = this.p1.tx * this.p2.Y,
			t9 = this.p2.tx * this.p1.Y;
		this.ctx.transform(
			-(this.p0.ty * t0 - t5 + t2 + this.pmy * this.p0.X) / this.d, // m11
			 (t6 + this.p0.ty * t1 - t4 - this.pmy * this.p0.Y) / this.d, // m12
			 (this.p0.tx * t0 - t3 + t7 + this.pmx * this.p0.X) / this.d, // m21
			-(t8 + this.p0.tx * t1 - t9 - this.pmx * this.p0.Y) / this.d, // m22
			 (this.p0.tx * (t2 - t5) + this.p0.ty * (t3 - t7) + this.pxy * this.p0.X) / this.d, // dx
			 (this.p0.tx * (t4 - t6) + this.p0.ty * (t8 - t9) + this.pxy * this.p0.Y) / this.d  // dy
		);
		// ---- draw ----
		this.ctx.drawImage(this.texture, 0, 0);
		this.ctx.restore();
	}
	return this.next;
}
/* ===================== image constructor ========================== */
ge1doot.transform3D.Image = function (parent, imgSrc, lev, callback) {
	this.parent        = parent;
	this.points        = [];
	this.triangles     = [];
	this.ctx           = ge1doot.screen.ctx;
	this.pointer       = ge1doot.pointer;
	this.texture       = new Image();
	this.texture.src   = imgSrc;
	this.isLoading     = true;
	this.callback      = callback;
	this.textureWidth  = 0;
	this.textureHeight = 0;
	this.level         = lev || 1;
	this.visible       = false;
	this.t             = false;
	if (!ge1doot.transform3D.Point.prototype.scr) {
		ge1doot.transform3D.Point.prototype.scr    = ge1doot.screen;
		ge1doot.transform3D.Point.prototype.camera = ge1doot.camera;
	}
}
/* ==== drawPoly prototype ==== */
ge1doot.transform3D.Image.prototype.drawPoly = ge1doot.transform3D.drawPoly;
/* ==== change tessellation level prototype ==== */
ge1doot.transform3D.Image.prototype.setLevel = function (level) {
	this.points.length = 0;
	this.triangles.length = 0;
	this.level = level;
	this.loading();
}
/* ==== loading prototype ==== */
ge1doot.transform3D.Image.prototype.loading = function () {
	if (this.texture.complete) {
		var dir = [0,1,1,0,0,0,1,1];
		this.isLoading = false;
		// ---- image size ----
		this.textureWidth = this.texture.width;
		this.textureHeight = this.texture.height;
		// ---- isLoaded callback ---
		this.callback && this.callback.isLoaded && this.callback.isLoaded(this);
		// ---- texture position ----
		for (var i = -1, p; p = this.points[++i];) {
			p.tx = this.textureWidth  * dir[i];
			p.ty = this.textureHeight * dir[i+4];
		}
		// ---- triangularization ----
		this.triangulate(this.points[0], this.points[1], this.points[2], this.level);
		this.triangulate(this.points[0], this.points[2], this.points[3], this.level);
		// ---- last point ----
		this.points[this.points.length - 1].next = false;
	}
}
/* ==== vector bisection function ==== */
ge1doot.transform3D.Image.prototype.subdivise = function (p0, p1) {
	return {
		x:  (p1.x + p0.x)   * 0.5,
		y:  (p1.y + p0.y)   * 0.5,
		z:  (p1.z + p0.z)   * 0.5,
		tx: (p1.tx + p0.tx) * 0.5,
		ty: (p1.ty + p0.ty) * 0.5
	};
}
/* ==== triangulation ==== */
ge1doot.transform3D.Image.prototype.triangulate = function (p0, p1, p2, level) {
	level--;
	if (level === 0) {
		// final triangle
		this.t = new ge1doot.transform3D.Triangle(this, p0, p1, p2);
		this.triangles.push(this.t);
	} else {
		// ---- subdivision ----
		var p01 = this.subdivise(p0, p1);
		var p12 = this.subdivise(p1, p2);
		var p20 = this.subdivise(p2, p0);
		// ---- insert new points ----
		this.points.push(p01 = new ge1doot.transform3D.Point(p01.x, p01.y, p01.z, p01.tx, p01.ty));
		this.points.push(p12 = new ge1doot.transform3D.Point(p12.x, p12.y, p12.z, p12.tx, p12.ty));
		this.points.push(p20 = new ge1doot.transform3D.Point(p20.x, p20.y, p20.z, p20.tx, p20.ty));
		// ---- recursive triangulation ----
		this.triangulate(p0,   p01,  p20, level);
		this.triangulate(p01,  p1,   p12, level);
		this.triangulate(p20,  p12,  p2,  level);
		this.triangulate(p01,  p12,  p20, level);
	}
}
/* ==== transform prototype ==== */
ge1doot.transform3D.Image.prototype.transform3D = function (backfaceTest) {
	if (this.isLoading) {
		// ---- image is loading ----
		this.loading();
		return false;
	} else {
		// ---- project points ----
		for (
			var i = 0;
			this.points[i++].projection();
		);
		if (backfaceTest) {
			var p0 = this.points[0];
			var p1 = this.points[1];
			var p2 = this.points[2];
			return (
				((p1.Y - p0.Y) / (p1.X - p0.X) - 
				(p2.Y - p0.Y) / (p2.X - p0.X) < 0) ^ 
				(p0.X <= p1.X == p0.X > p2.X)
			);
		} else return true;
	}
}
/* ==== draw prototype ==== */
ge1doot.transform3D.Image.prototype.draw = function () {
	if (!this.isLoading) {
		// ---- draw triangles ----
		for (
			var i = 0;
			this.triangles[i++].draw();
		);
	}
}
/* ==== isPointerInside prototype ==== */
ge1doot.transform3D.Image.prototype.isPointerInside = function (x, y) {
	this.drawPoly(this.points);
	return this.ctx.isPointInPath(x, y);
}
// ===== request animation frame =====

window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame   || 
		window.mozRequestAnimationFrame      || 
		window.oRequestAnimationFrame        || 
		window.msRequestAnimationFrame       || 
		function( run ){
			window.setTimeout(run, 16);
		};
})();

export default ge1doot;