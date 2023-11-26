export class Renderer {

    glCTX;
    vertexShader;
    fragmentShader;
    width;
    height;
    vertexShaderSource = `
        attribute vec2 position;
        uniform vec2 resolution;
        void main() {
          // Convert position from pixels to clip space
          vec2 clipspace = (position / resolution) * 2.0 - 1.0;
          gl_Position = vec4(clipspace, 0.0, 1.0);
        }
      `;

    fragmentShaderSource = `
        precision mediump float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }
      `;

    // Create shaders
    createShader(glCTX, type, source) {
        const shader = glCTX.createShader(type);
        glCTX.shaderSource(shader, source);
        glCTX.compileShader(shader);

        if (!glCTX.getShaderParameter(shader, glCTX.COMPILE_STATUS)) {
          console.error('Shader compilation failed:',glCTX.getShaderInfoLog(shader));
          glCTX.deleteShader(shader);
          return null;
        };
        return shader;
      };

    update() {
        console.debug("[Render]","DRAW BEGIN");

        console.debug("[Render]","SHADER ATTACH");
        // Create a program and link shaders
        const program = this.glCTX.createProgram();
        this.glCTX.attachShader(program, this.vertexShader);
        this.glCTX.attachShader(program, this.fragmentShader);
        this.glCTX.linkProgram(program);

        console.debug("[Render]",this.glCTX.getProgramParameter(program, this.glCTX.LINK_STATUS));
        if (!this.glCTX.getProgramParameter(program, this.glCTX.LINK_STATUS)) {
            console.error('Program linking failed:', this.glCTX.getProgramInfoLog(program));
            return;
        }

        this.glCTX.useProgram(program);

        // Define circle geometry
        const vertices = [];
        const numSegments = 100;
        const radius = 0.5;

        for (let i = 0; i < numSegments; i++) {
            const theta = (i / numSegments) * (2 * Math.PI);
            const x = radius * Math.cos(theta);
            const y = radius * Math.sin(theta);
            vertices.push(x, y);
        }

        // Create buffer and store geometry data
        console.debug("[Render]","GEOMETRY");
        const vertexBuffer = this.glCTX.createBuffer();
        this.glCTX.bindBuffer(this.glCTX.ARRAY_BUFFER, vertexBuffer);
        this.glCTX.bufferData(this.glCTX.ARRAY_BUFFER, new Float32Array(vertices), this.glCTX.STATIC_DRAW);

        // Get attribute location and enable it
        console.debug("[Render]","ENABLE ATTRIB");
        const positionAttribute =this.glCTX.getAttribLocation(program, 'position');
        this.glCTX.vertexAttribPointer(positionAttribute, 2,this.glCTX.FLOAT, false, 0, 0);
        this.glCTX.enableVertexAttribArray(positionAttribute);

        // Set resolution uniform
        console.debug("[Render]","RESOLUTION");
        const resolutionUniform =this.glCTX.getUniformLocation(program, 'resolution');
        this.glCTX.uniform2f(resolutionUniform, this.width, this.height);

        // Set color uniform
        console.debug("[Render]","UNIFORM");
        const colorUniform =this.glCTX.getUniformLocation(program, 'color');
        this.glCTX.uniform4f(colorUniform, 1.0, 0.0, 0.0, 1.0); // RGBA values (red)

        // Clear the canvas
        console.debug("[Render]","CLEAR");
        this.glCTX.clearColor(0.5, 0.5, 0.0, 1.0);
        this.glCTX.clear(this.glCTX.COLOR_BUFFER_BIT);

        console.debug("[Render]","CIRCLE");
        // Draw the circle
        this.glCTX.drawArrays(this.glCTX.LINE_LOOP, 0, numSegments);
        console.debug("[Render]","DRAW END");
    };

    constructor(context) {
        this.glCTX = context;
        this.width = context.width;
        this.height = context.height;
        this.vertexShader = this.createShader(this.glCTX, this.glCTX.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.createShader(this.glCTX, this.glCTX.FRAGMENT_SHADER, this.fragmentShaderSource);
        console.debug("[Render]","CONSTRUCTOR",this.width,this.height,this.vertexShader,this.fragmentShader);
    }
};
