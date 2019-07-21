import Drawing from "./Beans/Drawing";
import {IShape} from "./ShapeHandler";
import {IText} from "./Translator";

export default class Datastore {
    private _texts = [] as IText[];
    private _shapes = [] as IShape[];
    private _drawings = [] as Drawing[];
    private _translatedIds = new Map<number, number[]>();


    get texts(): IText[] {
        return this._texts;
    }

    get shapes(): IShape[] {
        return this._shapes;
    }

    get drawings(): Drawing[] {
        return this._drawings;
    }

    public addText(data: IText) {
        this._texts.push(data);
    }

    public addShape(data: IShape) {
        this.shapes.push(data)
    }

    public addDrawing(data: Drawing) {
        this.drawings.push(data)
    }

    public getShapeLines() {
        return this.shapes.map((x: IShape) => x.line)
    }

    public removeShapes(ids: number[]) {
        this._shapes = this.shapes.filter((value: IShape) => !ids.includes(value.id));
    }

    public foundShape(id: number) {
        return this.shapes.filter((x: IShape) => x.id === id).length > 0;
    }

    public addShapeTranslation(id: number, shapes: IShape[]) {
        this._translatedIds.set(id, shapes.map((x: IShape) => x.id));
    }

    public getAndDeleteTranslation(id: number) {
        const ids = this._translatedIds.get(id)!;

        this._translatedIds.delete(id);

        return ids;
    }

    public translationExists(id: number) {
        return this._translatedIds.has(id);
    }


}
