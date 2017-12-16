import { Component } from "react";

class Row extends React.Component {
    constructor() {

    }
    render() {
        var tds = [];
        for (i = 0; i < this.props.elements.length; i++) {
            for (key in this.props.elements[i]) {
                tds.append(<td>this.props.elements[i].key</td>);
            }
        }
        return (<tr>{tds}</tr>);
    }
}

export default Row;
