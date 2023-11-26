export class Renderer {

    glCTX;
    vertexShader;
    fragmentShader;
    width;
    height;
    vertexShaderSource2 = `
    attribute vec4 aVertexPosition;
    void main(void) {
      gl_Position = aVertexPosition;
    }`;
    vertexShaderSource =
    'attribute vec3 coordinates;' +
    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
    '}';
    fragmentShaderSource = `
    void main() {
      gl_FragColor = vec4(0.940,0.845,0.122,1.0);
    }`;

    // Create shaders
    buildShader(glCTX, type, source) {
        const shader = glCTX.createShader(type);
        glCTX.shaderSource(shader, source);
        glCTX.compileShader(shader);

        if (!glCTX.getShaderParameter(shader, glCTX.COMPILE_STATUS)) {
          console.error("[Render]","Shader compilation failed:",glCTX.getShaderInfoLog(shader));
          glCTX.deleteShader(shader);
          return null;
        };
        return shader;
      };
    
    buildProgram(glCTX,vertShader,fragShader) {
      const program = glCTX.createProgram();
      glCTX.attachShader(program,vertShader);
      glCTX.attachShader(program,fragShader);
      glCTX.linkProgram(program);

      if (!glCTX.getProgramParameter(program, glCTX.LINK_STATUS)) {
        console.error("[Render]","Create shader program failed:",glCTX.getProgramInfoLog(program));
        return null;
      };
      return program;
    }

    update() {
        console.debug("[Render]","DRAW BEGIN");

        const shaderProgram = this.buildProgram(this.glCTX,this.vertexShader,this.fragmentShader)
        
        // Define triangle geometry
        const offset = 0.05
        const verticies = new Float32Array([
          0.00, 0.10,
         -0.05, 0.00,
          0.05, 0.00,

         -0.05, 0.00,
         -0.10,-0.10,
          0.00,-0.10,

          0.05, 0.00,
          0.00,-0.10,
          0.10,-0.10,
        ]);

        // Create buffer and store geometry data
        console.debug("[Render]","GEOMETRY");
        const vertexBuffer = this.glCTX.createBuffer();
        this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER, vertexBuffer);
        this.glCTX.bufferData(this.glCTX.ARRAY_BUFFER, verticies, this.glCTX.STATIC_DRAW);

        // Get attribute location and enable it
        console.debug("[Render]","ENABLE ATTRIB");
        //const vertPosition = this.glCTX.getAttribLocation(shaderProgram, 'aVertexPosition');
        const vertPosition = this.glCTX.getAttribLocation(shaderProgram, 'coordinates');
        this.glCTX.vertexAttribPointer(vertPosition, 2,this.glCTX.FLOAT, false, 0, 0);
        this.glCTX.enableVertexAttribArray(vertPosition);

        // Set resolution uniform
        console.debug("[Render]","ENABLE PROGRAM");
        this.glCTX.useProgram(shaderProgram);

        // Clear the canvas
        console.debug("[Render]","CLEAR");
        this.glCTX.clearColor(0/255, 153/255, 102/255, 1.0);
        this.glCTX.clear(this.glCTX.COLOR_BUFFER_BIT);

        // Draw Triangle
        console.debug("[Render]","TRIANGLE");
        this.glCTX.drawArrays(this.glCTX.TRIANGLES, 0, 9);

        console.debug("[Render]","DRAW END");
    };

    constructor(context) {
        this.glCTX = context;
        this.width = context.canvas.width;
        this.height = context.canvas.height;
        this.vertexShader = this.buildShader(this.glCTX, this.glCTX.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.buildShader(this.glCTX, this.glCTX.FRAGMENT_SHADER, this.fragmentShaderSource);
        console.debug("[Render]","CONSTRUCTOR",this.width,this.height,this.vertexShader,this.fragmentShader);
    }
};
