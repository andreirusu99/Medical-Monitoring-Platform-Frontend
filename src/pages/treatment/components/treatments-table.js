import React from "react";
import Table from "../../../commons/tables/table";


const columns = [
    {
        Header: 'Start Date',
        accessor: 'startDate',
    },
    {
        Header: 'End Date',
        accessor: 'endDate',
    }
];

const filters = [
    {
        accessor: 'startDate'
    },
    {
        accessor: 'endDate'
    }
];

class TreatmentsTable extends React.Component {

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
                pageSize={5}
            />
        )
    }
}

export default TreatmentsTable;