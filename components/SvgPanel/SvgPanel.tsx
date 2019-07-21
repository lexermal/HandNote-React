import Svg, {Path, Text} from 'react-native-svg';
import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import ShapeHandler from "./ShapeHandler";
import {IText} from "./Translator";
import Drawing from "./Beans/Drawing";
import {ILine} from "./Beans/Line";
import Utils from "./Utils/Utils";

export default class SvgPanel extends React.Component<{}, State> {
    private shapes: ShapeHandler;

    constructor(props: {}, context: any) {
        super(props, context);
        this.onApiResult = this.onApiResult.bind(this);

        this.shapes = new ShapeHandler(this.onApiResult);

        this.state = {lines: [], activeLine: "", texts: [], drawings: []};
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
        const width = Utils.getWidth();

        return <Svg height="100%" width="100%" style={{backgroundColor: "orange"}}>
            {
                this.state.lines.map((line: string) => <Path key={line} d={line} stroke="black" fill="transparent"/>)
            }
            {
                this.state.drawings.map((line: Drawing) => line.getLines().map((x: ILine) =>
                    <Path key={x.id} d={x.line} stroke="black" fill="transparent"/>))
            }
            {
                this.state.texts.map((x: IText) => {
                    return <Text fill="none" stroke="purple" fontSize="20" key={x.id}
                                 fontWeight="bold" x={x.dimensions.left} y={x.dimensions.top} textAnchor="middle">{x.text}</Text>
                })
            }
            <Path d={this.state.activeLine} stroke="black" fill="transparent"/>
            <Path d={"M0 130, L" + width + ",130"} stroke="gray" fill="transparent"/>
            <Path d={"M0 200, L" + width + ",200"} stroke="gray" fill="transparent"/>
            <Path d={"M0 270, L" + width + ",270"} stroke="gray" fill="transparent"/>
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
    texts: IText[]
    lines: string[]
    drawings: Drawing[]
    activeLine: string
}
