/*
    Stacked canvases for drawing on different layers
    @param {string} container element in DOM
    @param {int} width Width of canvases
    @param {int} height Height of canvases
    @param {int} num_layers Number of layer types
    @param {string} id_prefix Id to identify canvases
    @param {string} class Classes added to each canvas
*/
export class ZCanvas {
    constructor(
        container,
        width,
        height,
        num_layers,
        id_prefix="zcanvas-",
        classes="zcanvas",
        ) {

        this.container = container;
        this.width = width;
        this.height = height;
        this.num_layers = num_layers;
        this.id_prefix = id_prefix;
        this.class = classes;

        this.canvases = [];
        this.contexts = Array(num_layers).fill(null);
        this.context_types = Array(num_layers).fill(null);
        for (let i=0; i<this.num_layers; i++) {
            const canvas = document.createElement('canvas');
            canvas.id = `${this.id_prefix}${i}`;
            canvas.classList.add(this.class)
            canvas.style.zIndex = i;
            canvas.style.position = 'absolute';
            canvas.style.border = '1px solid black';
            canvas.height = height;
            canvas.width = width;

            this.canvases.push(canvas);

            this.container.insertAdjacentElement("beforeend", canvas);
        }
    }

    getContext(layer_num, type) {
        if (this.contexts[layer_num] === null) {
            console.assert(['2d', 'webgl'].indexOf(type) > -1, `Context type must be '2d' or 'webgl', not '${type}'`)
            const ctx = this.canvases[layer_num].getContext(type);
            
            // add simple clear function to context
            if (type === "2d") {
                ctx.clear = function() {
                    ctx.clearRect(0, 0, this.width, this.height);
                }.bind(this);
            }
            
            this.contexts[layer_num] = ctx;
            this.context_types[layer_num] = type;
            return ctx;
        } else {
            console.assert(this.context_types[layer_num] === type, `Context type must match, ${type} != ${this.context_types[layer_num]}`);
            return this.contexts[layer_num];
        }
    }
}