import Shape from "./Beans/Shape";
import Utils from "./Utils/Utils";
import Datastore from "./Datastore";
import Drawing from "./Beans/Drawing";
import Translator, {IText} from "./Translator";

export default class ShapeHandler {
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
        this.activeShape = new Shape(x, y, Utils.getUnusedId((id: number) => this.checkFound(id)));
    }

    public async end() {
        this.datastore.addShape(this.activeShape!.getShape()!);
        this.translator.startCountdown(this.datastore.shapes)
    }

    public getShapeLines(): string[] {
        return this.datastore.getShapeLines();
    }

    public getActiveShape() {
        return this.activeShape!.getShapeLines();
    }

    private checkFound(id: number): boolean {
        const activeFound = this.activeShape && this.activeShape.getId() === id;

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
