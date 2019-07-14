export default class Shape {
    private shapes = [] as string[];
    private activeShape = "";
    private lastX = 0;
    private lastY = 0;
    private tolerance = 10;  //Defines the touch sensitivity in px



    public async addPosition(x: number, y: number) {
        if (Math.sqrt(Math.pow(this.lastX - x, 2) + Math.pow(this.lastY - y, 2)) > this.tolerance) {
            this.activeShape += ", L" + x + " " + y;
        }
    }

    public async start(x: number, y: number) {
        this.activeShape = "M " + x + " " + y;
        this.lastX = x;
        this.lastY = y;
    }

    public async end() {
        this.shapes.push(this.activeShape);
        this.activeShape = "";
        this.lastX = 0;
        this.lastY = 0;
    }

    public getShapes() {
        return this.shapes;
    }

    public getActiveShape() {
        return this.activeShape;
    }
}
