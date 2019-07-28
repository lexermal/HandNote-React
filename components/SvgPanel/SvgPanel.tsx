import Svg, {Path, Text} from 'react-native-svg';
import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import ShapeHandler from "./ShapeHandler";
import {IText} from "./Translator";
import Drawing from "../../services/Beans/Drawing";
import {ILine} from "../../services/Beans/Line";
import Utils from "../../services/Utils/Utils";

export default class SvgPanel extends React.Component<{}, State> {
    private shapes: ShapeHandler;

    constructor(props: {}, context: any) {
        super(props, context);
        this.onApiResult = this.onApiResult.bind(this);

        this.shapes = new ShapeHandler(this.onApiResult);

        this.state = {lines: [], activeLine: "", texts: [], drawings: [], width: 0};
    }

    public componentDidMount(): void {
        this.setState({width: Utils.getWidth()})
    }

    public componentDidUpdate(): void {
        const width = Utils.getWidth();

        if (this.state.width !== width) {
            this.setState({width})
        }
    }

    private touchEnded() {
        this.shapes.end().then(() => this.setState({lines: this.shapes.getShapeLines(), activeLine: ""}));
    }

    private touchStart(x: number, y: number) {
        this.shapes.start(Math.round(x), Math.round(y)).then();
    }

    render() {
        return <View style={[StyleSheet.absoluteFill, {alignItems: 'center', justifyContent: 'center'},]}
                     onTouchMove={(e: GestureResponderEvent) => this.setPosition(e.nativeEvent.pageX, e.nativeEvent.pageY)}
                     onTouchEnd={() => this.touchEnded()}
                     onTouchStart={(e: GestureResponderEvent) => this.touchStart(e.nativeEvent.locationX, e.nativeEvent.locationY)}>

            {this.renderSVG()}
        </View>
    }

    private renderSVG() {
        return <Svg height="100%" width="100%" style={{backgroundColor: "orange"}}>
            {
                this.state.lines.map((line: string) => <Path key={line} d={line} stroke="black" fill="transparent"/>)
            }
            {
                this.state.drawings.map((line: Drawing) => line.getLines().map((x: ILine) =>
                    <Path key={x.id} d={x.line} stroke="black" fill="transparent" strokeWidth={4}/>))
            }
            {
                this.state.texts.map((x: IText) => {
                    const posX = x.dimensions.left + (x.dimensions.right - x.dimensions.left) / 2;
                    const posY = x.dimensions.top + (x.dimensions.bottom - x.dimensions.top) / 2;

                    return <Text fontSize="40" key={x.id} x={posX} y={posY} textAnchor="middle">{x.text}</Text>
                })
            }
            <Path d={"M0 1, L" + 75 + ",1"} stroke="black" fill="transparent"/>
            <Path d={this.state.activeLine} stroke="black" fill="transparent"/>
            <Path d={"M0 210, L" + this.state.width + ",210"} stroke="gray" fill="transparent"/>
            <Path d={"M0 250, L" + this.state.width + ",250"} stroke="gray" fill="transparent"/>
            <Path d={"M0 290, L" + this.state.width + ",290"} stroke="gray" fill="transparent"/>
        </Svg>
    }

    private onApiResult(result: IText[], shapes: string[], drawings: Drawing[]) {
        this.setState({texts: result, lines: shapes, drawings})
    }

    private setPosition(x: number, y: number) {
        this.shapes.addPosition(Math.round(x), Math.round(y)).then((result: boolean) => {
            if (result) {
                this.setState({activeLine: this.shapes.getActiveShape()})
            }
        });
    }

}

interface State {
    width: number
    texts: IText[]
    lines: string[]
    drawings: Drawing[]
    activeLine: string
}
