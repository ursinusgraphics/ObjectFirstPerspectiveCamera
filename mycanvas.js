/**
    A class to teach students about gluLookAt 

    Assumes that
    ggslac/viewers/scenecanvas.js
    ggslac/viewers/basecanvas.js
    have been included already
 */

 /**
  * A function inspired by the old school gluLookAt() function
  * Return a matrix that will transform the objects in the scene
  * so that it as if someone is looking from position "eye" towards
  * position "center," while trying to keep the up direction as close to "up"
  * as possible
  * 
  * @param {vec3} eye The eye of the viewer
  * @param {vec3} center The point we want the camera to look at
  * @param {vec3} up The up direction we try to maintain
  */
function gluLookAt(eye, center, up) {
    m = glMatrix.mat4.create();
    // TODO: FILL THIS IN
    return m;
}

/**
 * 
 * @param {float} fovx 
 * @param {float} fovy 
 * @param {float} near 
 * @param {float} far 
 */
function getPMatrix(fovx, fovy, near, far) {
    let pMatrix = glMatrix.mat4.create();
    let fovx2 = fovx * 90/Math.PI;
    let fovy2 = fovy * 90/Math.PI;
    let fov = {upDegrees:fovy2, downDegrees:fovy2, 
               leftDegrees:fovx2, rightDegrees:fovx2};
    glMatrix.mat4.perspectiveFromFieldOfView(pMatrix, fov, near, far);
    return pMatrix;
}


function MyCamera() {
    this.fovx = 1.4;
    this.fovy = 1.1;
    this.eye = glMatrix.vec3.fromValues(0, 1.5, 5);
    this.pos = this.eye; // Need pos for camera API
    this.center = glMatrix.vec3.fromValues(0, 1, -10);
    this.up = glMatrix.vec3.fromValues(0, 1, 0);
    this.near = DEFAULT_NEAR;
    this.far = DEFAULT_FAR;


    this.getPMatrix = function() {
        return getPMatrix(this.fovx, this.fovy, this.near, this.far);
    }

    this.getMVMatrix = function() {
        return gluLookAt(this.eye, this.center, this.up);
    }
}

/**
 * 
 * @param {DOM Element} glcanvas Handle to HTML where the glcanvas resides
 */
function MyCanvas(glcanvas, shadersrelpath, meshesrelpath) {
    SceneCanvas(glcanvas, shadersrelpath, meshesrelpath);
    glcanvas.mycamera = new MyCamera();
    console.log(glcanvas.mycamera);


    let menu = glcanvas.gui.addFolder('My Camera');
    glcanvas.eyevec = vecToStr(glcanvas.mycamera.eye);
    menu.add(glcanvas, 'eyevec').listen().onChange(
        function(value) {
            let xyz = splitVecStr(value);
            for (let k = 0; k < 3; k++) {
                glcanvas.mycamera.eye[k] = xyz[k];
                glcanvas.mycamera.pos[k] = xyz[k];
            }
            requestAnimFrame(glcanvas.repaint);
        }
    );
    glcanvas.centervec = vecToStr(glcanvas.mycamera.center);
    menu.add(glcanvas, 'centervec').listen().onChange(
        function(value) {
            let xyz = splitVecStr(value);
            for (let k = 0; k < 3; k++) {
                glcanvas.mycamera.center[k] = xyz[k];
            }
            requestAnimFrame(glcanvas.repaint);
        }
    );
    glcanvas.upvec = vecToStr(glcanvas.mycamera.up);
    menu.add(glcanvas, 'upvec').listen().onChange(
        function(value) {
            let xyz = splitVecStr(value);
            for (let k = 0; k < 3; k++) {
                glcanvas.mycamera.up[k] = xyz[k];
            }
            requestAnimFrame(glcanvas.repaint);
        }
    );

    menu.add(glcanvas.mycamera, 'fovx', 0.5, 3).onChange(
        function() {
            requestAnimFrame(glcanvas.repaint);
        }
    );
    menu.add(glcanvas.mycamera, 'fovy', 0.5, 3).onChange(
        function() {
            requestAnimFrame(glcanvas.repaint);
        }
    );
    glcanvas.usingMyCamera = false;
    menu.add(glcanvas, 'usingMyCamera').onChange(
        function(v) {
            if (v) {
                // Toggle other lights viewFrom
                glcanvas.scene.lights.forEach(function(camera) {
                    camera.viewFrom = false;
                });
                // Turn off all regular cameras viewFrom
                glcanvas.scene.cameras.forEach(function(camera) {
                    camera.viewFrom = false;
                })
                glcanvas.camera = glcanvas.mycamera;
                requestAnimFrame(glcanvas.repaint);
            }
            requestAnimFrame(glcanvas.repaint);
        }
    );

    glcanvas.showCameras = false;
    glcanvas.myMenu = menu;
}
