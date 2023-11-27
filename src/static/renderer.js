export class Renderer {

    glCTX;

    vertexShader;
    fragmentShader;
    shaderProgram;
    verticies = new Float32Array([
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

    vertexShaderSource =`
      attribute vec3 coordinates;
      void main(void) {
        gl_Position = vec4(coordinates, 1.0);
      }`;
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
          console.error("Shader compilation failed:",glCTX.getShaderInfoLog(shader));
          glCTX.deleteShader(shader);
          return null;
        };
        console.info(`Shader compile successful (${type})`);
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
      console.info("Program build successful");
      return program;
    }

    paint(timeDelta) {

        // Clear the canvas
        this.glCTX.clear(this.glCTX.COLOR_BUFFER_BIT);

        // Draw Triangle
        this.glCTX.drawArrays(this.glCTX.TRIANGLES, 0, 9);
    };

    constructor(context) {
        this.glCTX = context;

        //canvas maintenance settings
        this.glCTX.clearColor(64/255, 64/255, 64/255, 1.0); //set gr(a|e)y

        //Compile and assign shaders and program
        this.vertexShader = this.buildShader(this.glCTX, this.glCTX.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.buildShader(this.glCTX, this.glCTX.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.shaderProgram = this.buildProgram(this.glCTX,this.vertexShader,this.fragmentShader)
        this.glCTX.useProgram(this.shaderProgram);

        //VBO our verticies
        const vertexBuffer = this.glCTX.createBuffer();
        this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER, vertexBuffer);
        this.glCTX.bufferData(this.glCTX.ARRAY_BUFFER, this.verticies, this.glCTX.STATIC_DRAW);

        //Setup attributes / 'expose' attirbutes for use in GLSL shader code stuff
        const vertPosition = this.glCTX.getAttribLocation(this.shaderProgram, 'coordinates');
        this.glCTX.vertexAttribPointer(vertPosition, 2,this.glCTX.FLOAT, false, 0, 0);
        this.glCTX.enableVertexAttribArray(vertPosition);

        console.debug("[Render]","CONSTRUCTOR",this.width,this.height,this.vertexShader,this.fragmentShader);
    }
};