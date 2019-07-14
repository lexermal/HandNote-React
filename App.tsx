import React from 'react';
import SvgPanel from "./components/SvgPanel/SvgPanel";

export default class SvgExample extends React.Component<{}, {}> {

    constructor(props: {}, context: any) {
        super(props, context);
    }

    render() {
        return <SvgPanel/>
    }
}
