import {Dimensions} from "react-native";
import Line, {ILine} from "./Line";

export default class Shape extends Line {

    constructor(x: number, y: number, id: number) {
        super(x, y, id, Shape.getOrientation());
        Dimensions.addEventListener('change', () => this.setOrientation(Shape.getOrientation()));
    }

    private static getOrientation() {
        return Dimensions.get('window').width < Dimensions.get('window').height;
    }

    public getShapeLines() {
        return this.getLineObject().line;
    }

    public getShape(): IShape {
        return this.getLineObject();
    }
}

export interface IShape extends ILine {
}
