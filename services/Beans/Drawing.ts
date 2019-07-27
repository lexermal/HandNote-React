import {ILine} from "./Line";

export default class Drawing {
    private lines = [] as ILine[];

    public addLine(line: ILine) {
        this.lines.push(line);
    }

    public getLines() {
        return this.lines;
    }
}
