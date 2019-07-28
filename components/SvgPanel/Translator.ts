import API from "../../services/API";
import {IShape} from "./ShapeHandler";
import {ToastAndroid} from "react-native";
import Utils from "../../services/Utils/Utils";
import {ILine} from "../../services/Beans/Line";
import Waiter from "../../services/Utils/Waiter";
import Datastore from "../../services/Datastore";
import Drawing from "../../services/Beans/Drawing";

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

    public stopCountDown() {
        this.waiter.stopCountDown();
    }

    public submitShapes() {
        if (this.shapes.length > 0) {

            const id = Utils.getUnusedId((id: number) => this.datastore.translationExists(id));
            this.datastore.addShapeTranslation(id, this.shapes);

            this.api.sendData(this.shapes, id);
        }
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
        console.log("ERROR: ", e);

        if (e.error) {
            ToastAndroid.show(e.error.message, ToastAndroid.SHORT);
        }
    }

    private transformText(data: any): IText {

        const foundIds = this.datastore.getAndDeleteTranslation(
            Math.min(...data.strokeIds.map((id: number) => Math.floor(id / 100))));

        const shape = this.shapes.filter((x: IShape) => foundIds.includes(x.id))[0];

        if (!shape) {
            console.log("found no ids:" + foundIds);
            console.log("data: ", data)
        }

        return {
            dimensions: shape ? shape.dimensions : {top: 0, bottom: 0, left: 0, right: 0},
            text: data.recognizedText,
            id: Math.random(),
            shapeId: shape ? shape.id : Math.random()
        }
    }

    private transformDrawing(data: any): Drawing {
        const ids = this.datastore.getAndDeleteTranslation(Math.min(...data.strokeIds.map((id: number) => Math.floor(id / 100))));

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

