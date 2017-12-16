import { Row } from "./Row";

class TableComponent extends React.Component {
    constructor() {

    }
    render() {
        if (this.props.type === "thead") {
            return (<thead><Row elements={this.props.elements}></Row></thead>);
        }
        else if (this.props.type === "tbody") {
            return (<tbody><Row elements={this.props.elements}></Row></tbody>);
        }
        else if (this.props.type === "tfoot") {
            return (<tfoot><Row elements={this.props.elements}></Row></tfoot>);
        }
    }
}

export default TableComponent;
