import Waiter from "./Utils/Waiter";
import {IShape} from "./ShapeHandler";
import {ILine} from "./Beans/Line";
import Utils from "./Utils/Utils";
import Drawing from "./Beans/Drawing";
import API from "./API";
import Datastore from "./Datastore";
import {ToastAndroid} from "react-native";

export default class Translator {
    private api: API;
    private shapes = [] as IShape[];
    private defaultWaitingTime = 3000;
    private datastore = new Datastore();
    private readonly resultHandler: (result: IText | Drawing, shapeIds: number[]) => void;

    private waiter = new Waiter(() => this.submitShapes(), this.defaultWaitingTime);

    constructor(resultHandier: (result: IText | Drawing, shapeIds: number[]) => void) {
        this.resultHandler = resultHandier;
        this.api = new API((data: any) => this.onResult(data), this.onError);
    }

    public startCountdown(shapes: IShape[]) {
        const shapeIds = shapes.map((x: IShape) => x.id);

        this.shapes = this.shapes.filter((x: IShape) => !shapeIds.includes(x.id));
        this.shapes.push(...shapes);

        this.waiter.startCountDown();
    }

    public submitShapes() {
        const id = Utils.getUnusedId((id: number) => this.datastore.translationExists(id));
        this.datastore.addShapeTranslation(id, this.shapes);

        this.api.sendData(this.shapes, id);
    }

    private onResult(data: any) {
        if (data.category === "inkWord") {
            this.resultHandler(this.transformText(data), this.shapes.map((x: IShape) => x.id));
        } else {
            this.resultHandler(this.transformDrawing(data), this.shapes.map((x: IShape) => x.id));
        }

        this.shapes = [];
    }

    private onError(e: any) {
        console.log(e);

        ToastAndroid.show(e.error.message, ToastAndroid.SHORT);
    }

    private transformText(data: any): IText {
        const foundIds = this.datastore.getAndDeleteTranslation(Math.min(...data.strokeIds));

        const shape = this.shapes.filter((x: IShape) => x.id === foundIds[0])[0];

        return {
            dimensions: shape.dimensions,
            text: data.recognizedText,
            id: Math.random(),
            shapeId: shape.id
        }
    }

    private transformDrawing(data: any): Drawing {
        const ids = this.datastore.getAndDeleteTranslation(Math.min(data.strokeIds));

        const drawing = new Drawing();
        this.shapes.filter((x: IShape) => ids.includes(x.id)).forEach((l: ILine) => drawing.addLine(l));

        return drawing;
    }
}

export interface IText {
    dimensions: {
        left: number
        right: number
        top: number
        bottom: number
    }
    text: string
    id: number,
    shapeId: number
}

