export class Renderer {

    glCTX;
    FPS;
    fsSrc = {};
    vsSrc = {};
    fs = {};
    vs = {};
    prog = {};
    vbo = {};
    matrix = {};
    verts = {
    'faces' : new Float32Array([
      //Front 3 faces
      0.00, 0.10, 0.00,
     -0.05, 0.00, 0.00,
      0.05, 0.00, 0.00,

     -0.05, 0.00, 0.00,
     -0.10,-0.10, 0.00,
      0.00,-0.10, 0.00,

      0.05, 0.00, 0.00,
      0.00,-0.10, 0.00,
      0.10,-0.10, 0.00,

      //Back 3 faces
      0.00, 0.10, 0.0075,
     -0.05, 0.00, 0.0075,
      0.05, 0.00, 0.0075,

     -0.05, 0.00, 0.0075,
     -0.10,-0.10, 0.0075,
      0.00,-0.10, 0.0075,

      0.05, 0.00, 0.0075,
      0.00,-0.10, 0.0075,
      0.10,-0.10, 0.0075,

      //Outer left edge faces
      0.00, 0.10, 0.00,
     -0.10,-0.10, 0.00,
     -0.10,-0.10, 0.0075,
     
     -0.10,-0.10, 0.0075,
      0.00, 0.10, 0.00,
      0.00, 0.10, 0.0075,

      //Outer right edge faces      
      0.00, 0.10, 0.00,
      0.10,-0.10, 0.00,
      0.10,-0.10, 0.0075,

      0.00, 0.10, 0.00,
      0.00, 0.10, 0.0075,
      0.10,-0.10, 0.0075,


    ])};

    // Create shaders
    buildShader(glCTX, type, source) {
      let typeText = `Unknown Type (ID:${type})`;
      switch (type) {
        case this.glCTX.VERTEX_SHADER:
          typeText = 'VERTEX_SHADER';
          break;
        case this.glCTX.FRAGMENT_SHADER:
          typeText = 'FRAGMENT_SHADER';
          break;
      }
      const shader = glCTX.createShader(type);
      glCTX.shaderSource(shader, source);
      glCTX.compileShader(shader);

      if (!glCTX.getShaderParameter(shader, glCTX.COMPILE_STATUS)) {
        console.error(`Shader compilation failed (${typeText}): ${glCTX.getShaderInfoLog(shader)}`);
        glCTX.deleteShader(shader);
        return null;
      };
      console.debug(`Shader compile successful (${typeText})`);
      return shader;
      };
    
    buildProgram(glCTX,vertShader,fragShader) {
      const program = glCTX.createProgram();
      glCTX.attachShader(program,vertShader);
      glCTX.attachShader(program,fragShader);
      glCTX.linkProgram(program);

      if (!glCTX.getProgramParameter(program, glCTX.LINK_STATUS)) {
        console.error("Create shader program failed:",glCTX.getProgramInfoLog(program));
        return null;
      };
      console.debug("Program build successful");
      return program;
    }
    swapProgram(prog) {
      this.PROGRAM = prog;
      this.glCTX.useProgram(prog);
    }

    paint(frameDelta) {

        // Clear the canvas
        this.glCTX.clear(this.glCTX.COLOR_BUFFER_BIT);
        
        //Switch to 1st program and setup locations
        this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER,this.vbo.faces);
        let modelViewMatrixUniformLocation = this.glCTX.getUniformLocation(this.PROGRAM, 'u_modelViewMatrix');
        let projectionMatrixUniformLocation = this.glCTX.getUniformLocation(this.PROGRAM, 'u_projectionMatrix');

        //This is hacky (exploded formula) but there's some performance bugs/leaks *somewhere* and it's useful for debugging. Optimize later.
        let rotationsPerSec = 0.25;
        let fpsMS = 1000/this.FPS;
        let frameCount = frameDelta / fpsMS;
        let secondsOfAdvance = frameCount * (rotationsPerSec/this.FPS);
        let rotationSpeed = ((Math.PI * 2) * secondsOfAdvance);
        mat4.rotateY(this.matrix.modelView, this.matrix.modelView, rotationSpeed);

        this.glCTX.uniformMatrix4fv(modelViewMatrixUniformLocation, false, this.matrix.modelView);
        this.glCTX.uniformMatrix4fv(projectionMatrixUniformLocation, false, this.projectionMatrix);

        // Draw Triangle
        this.glCTX.drawArrays(this.glCTX.TRIANGLES, 0, this.verts.faces.length / 3);
    };

    constructor(context,FPS) {
      console.group("[Renderer Constructor]");
      this.glCTX = context;
      this.FPS = FPS;

      //Shaders
      this.fsSrc = {
      'TriForceYellow' : `
      void main() {
        gl_FragColor = vec4(0.940,0.845,0.122,1.0);
      }`,
      'Black' : `
      void main() {
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
      }
      `};

      this.vsSrc = {
      'ProjectionView' : `
      attribute vec4 a_position;
      uniform mat4 u_modelViewMatrix;
      uniform mat4 u_projectionMatrix;
      void main(void) {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
      }`,
      'Simple' : `
      attribute vec4 a_position;
      void main(void) {
        gl_Position = a_position;
      }`
      };

      //canvas maintenance settings
      this.glCTX.clearColor(64/255, 64/255, 64/255, 1.0); //set gr(a|e)y

      //Compile and assign shaders and program
      this.vs.Simple = this.buildShader(this.glCTX, this.glCTX.VERTEX_SHADER, this.vsSrc.ProjectionView);
      this.vs.ProjectionView = this.buildShader(this.glCTX, this.glCTX.VERTEX_SHADER, this.vsSrc.ProjectionView);

      this.fs.TriForceYellow = this.buildShader(this.glCTX, this.glCTX.FRAGMENT_SHADER, this.fsSrc.TriForceYellow);
      this.fs.Black = this.buildShader(this.glCTX, this.glCTX.FRAGMENT_SHADER, this.fsSrc.Black);

      this.prog.ProjectionView_TriForceYellow = this.buildProgram(this.glCTX,this.vs.ProjectionView,this.fs.TriForceYellow);
      this.prog.ProjectionView_Black = this.buildProgram(this.glCTX,this.vs.ProjectionView,this.fs.Black);

      this.prog.Simple_TriForceYellow = this.buildProgram(this.glCTX,this.vs.Simple,this.fs.TriForceYellow);
      this.prog.Simple_Black = this.buildProgram(this.glCTX,this.vs.Simple,this.fs.Black);
      console.debug('Vertex Shaders, Fragment Shader, Programs built.');

      //VBO our verticies/* 
      this.vbo.faces = this.glCTX.createBuffer();
      //this.vbo.edges = this.glCTX.createBuffer();
      
      this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER, this.vbo.faces);
      this.glCTX.bufferData(this.glCTX.ARRAY_BUFFER, this.verts.faces, this.glCTX.STATIC_DRAW);

      //this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER, this.vbo.edges);
      //this.glCTX.bufferData(this.glCTX.ARRAY_BUFFER, this.verts.edges, this.glCTX.STATIC_DRAW);

      console.debug('Verts VBO\'d');

      this.swapProgram(this.prog.ProjectionView_TriForceYellow);

      // Enable attributes
      this.positionAttribLocation = this.glCTX.getAttribLocation(this.PROGRAM, 'a_position');
      this.glCTX.enableVertexAttribArray(this.positionAttribLocation);
      this.glCTX.vertexAttribPointer(this.positionAttribLocation, 3, this.glCTX.FLOAT, false, 0, 0);

      // Set up the projection matrix (perspective projection)
      this.projectionMatrix = mat4.create();
      mat4.perspective(this.projectionMatrix, Math.PI / 4, context.canvas.width / context.canvas.height, 0.1, 100.0);

      // Set up the model-view matrix for rotation
      this.matrix.modelView = mat4.create();
      mat4.translate(this.matrix.modelView, this.matrix.modelView, [0.0, 0.0, -1.0]); // Move the object away from the camera

      console.groupEnd();
    }
};