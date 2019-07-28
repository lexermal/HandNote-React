import Shape from "../../services/Beans/Shape";
import Utils from "../../services/Utils/Utils";
import Datastore from "../../services/Datastore";
import Drawing from "../../services/Beans/Drawing";
import Translator, {IText} from "./Translator";

export default class ShapeHandler {
    private defaultSpace = 75;
    private translator: Translator;
    private datastore = new Datastore();
    private activeShape: Shape | undefined;
    private readonly textDrawHandler: (result: IText[], lines: string[], drawings: Drawing[]) => void;

    constructor(textDrawHandler: (result: IText[], lines: string[], drawings: Drawing[]) => void) {
        this.textDrawHandler = textDrawHandler;
        this.apiResult = this.apiResult.bind(this);

        this.translator = new Translator(this.apiResult);
    }

    public async addPosition(x: number, y: number): Promise<boolean> {
        return this.activeShape!.addPosition(x, y);
    }

    public async start(x: number, y: number) {

        if (this.datastore.shapes.length > 0 && this.activeShape && this.checkIfNewShape(x, y, this.activeShape.getShape())) {
            console.log("New Shape, submit old");
            this.translator.submitShapes();
        } else if (this.datastore.shapes.length > 0) {
            this.translator.stopCountDown();
        }

        this.activeShape = new Shape(x, y, Utils.getUnusedId((id: number) => this.checkFound(id)));
    }

    public async end() {
        this.datastore.addShape(this.activeShape!.getShape()!);
        this.translator.startCountdown(this.datastore.shapes);
        // setTimeout(() => this.translator.startCountdown(this.datastore.shapes), 100)
    }

    public getShapeLines(): string[] {
        return this.datastore.getShapeLines();
    }

    public getActiveShape() {
        return this.activeShape!.getShapeLines();
    }

    private checkIfNewShape(x: number, y: number, activeShape: IShape): boolean {
        const box = activeShape.dimensions;

        const vertical = this.isVerticalOutside(box.top, box.bottom, y);
        const horizontal = this.isHorzontalOutside(box.left, box.right, x);

        return vertical || horizontal;
    }

    private isHorzontalOutside(left: number, right: number, newX: number) {
        return (right + this.defaultSpace < newX) || (left - this.defaultSpace > newX);
    }

    private isVerticalOutside(top: number, bottom: number, newY: number) {
        //old shape above or shape underneath
        return (bottom + this.defaultSpace < newY) || (top - this.defaultSpace > newY);
    }

    private checkFound(id: number): boolean {
        const activeFound = this.activeShape && this.activeShape!.getId() === id;

        return this.datastore.foundShape(id) || (activeFound || false);
    }

    private apiResult(data: IText | Drawing, shapeIds: number[]) {
        if (data.hasOwnProperty("text")) {
            this.datastore.addText(data as IText);
        } else {
            this.datastore.addDrawing(data as Drawing);
        }

        this.datastore.removeShapes(shapeIds);

        this.textDrawHandler(this.datastore.texts, this.datastore.getShapeLines(), this.datastore.drawings);
    }
}

export interface IShape {
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
