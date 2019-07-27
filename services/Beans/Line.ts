export default class Line {
    private lastX = 0;
    private lastY = 0;
    private id: number;
    private tolerance = 10;
    private line: ILine;
    private isVertical = true;

    constructor(x: number, y: number, id: number, isVertical: boolean) {
        this.id = id;
        this.lastX = x;
        this.lastY = y;
        this.isVertical = isVertical;
        this.line = this.newLine(x, y, id);
    }

    public getId() {
        return this.id;
    }

    protected setOrientation(isVertical: boolean) {
        this.isVertical = isVertical;
    }

    public async addPosition(x: number, y: number): Promise<boolean> {
        if (Math.sqrt(Math.pow(this.lastX - x, 2) + Math.pow(this.lastY - y, 2)) > this.tolerance) {
            this.updateDrawing(x, y);
            return true
        }
        return false
    }

    private updateDrawing(x: number, y: number) {
        const box = this.line!.dimensions;

        this.line = {
            id: this.line!.id,
            line: this.line!.line + "L " + x + " " + y,
            isVertical: this.line!.isVertical,
            dimensions: {
                left: box.left > x ? x : box.left,
                right: box.right < x ? x : box.right,
                top: box.top > y ? y : box.top,
                bottom: box.bottom < y ? y : box.bottom
            }
        }
    }

    private newLine(x: number, y: number, id: number) {
        return {
            id,
            line: "M " + x + " " + y,
            isVertical: this.isVertical,
            dimensions: {
                left: x,
                right: x,
                top: y,
                bottom: y
            }
        }
    }

    public async end() {
        this.lastX = 0;
        this.lastY = 0;
    }

    public getLines() {
        return this.line!.line
    }

    public getLineObject(): ILine {
        return this.line;
    }
}

export interface ILine {
    dimensions: {
        left: number
        right: number
        top: number
        bottom: number
    }
    line: string
    isVertical: boolean
    id: number
}
