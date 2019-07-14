import Svg, {Path} from 'react-native-svg';
import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import Shape from "./Shape";

export default class SvgPanel extends React.Component<{}, { lines: string[], activeLine: string }> {
    private shapes = new Shape();

    constructor(props: {}, context: any) {
        super(props, context);
        this.state = {lines: [], activeLine: ""}
    }

    private setPosition(x: number, y: number) {
        this.shapes.addPosition(x, y).then(() => this.setState({activeLine: this.shapes.getActiveShape()}));
    }

    private touchEnded() {
        this.shapes.end().then(() => this.setState({lines: this.shapes.getShapes()}));
    }

    private touchStart(x: number, y: number) {
        this.shapes.start(x, y).then();
    }

    render() {
        return <View style={[StyleSheet.absoluteFill, {alignItems: 'center', justifyContent: 'center'},]}
                     onTouchMove={(e: GestureResponderEvent) => this.setPosition(e.nativeEvent.pageX, e.nativeEvent.pageY)}
                     onTouchEnd={() => this.touchEnded()}
                     onTouchStart={(e: GestureResponderEvent) => this.touchStart(e.nativeEvent.locationX, e.nativeEvent.locationY)}>

            <Svg height="100%" width="100%" style={{backgroundColor: "orange"}}>
                {
                    this.state.lines.map((line: string) => <Path key={line} d={line} stroke="black" fill="transparent"/>)
                }
                <Path d={this.state.activeLine} stroke="black" fill="transparent"/>
            </Svg>
        </View>
    }
}
