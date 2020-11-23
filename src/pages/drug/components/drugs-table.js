import React from "react";
import Table from "../../../common/tables/table";


const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Side Effects',
        accessor: 'sideEffects',
    },
    {
        Header: 'Daily Dosage',
        accessor: 'dosage',
    }
];

const filters = [
    {
        accessor: 'name'
    },
    {
        accessor: 'dosage'
    }
];

class DrugsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
        )
    }
}

export default DrugsTable;