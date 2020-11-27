import React from "react";

const {PillBoxServiceClient} = require("../../../proto/generated/PillBox_grpc_web_pb")
const {MedicationPlanRequest, MedicationPlanResponse} = require("../../../proto/generated/PillBox_pb")

const grpc_client = new PillBoxServiceClient('http://localhost:9191', null, null)

class PillboxContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        const {match: {params}} = this.props
        const request = new MedicationPlanRequest()
        request.setPatientid(params.patientId)

        grpc_client.downloadMedicationPlan(request, {}, (err, response) => {
            if (response == null) {
                console.log(err)
            }else {
                console.log(response.getItemsList())
            }
        })
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default PillboxContainer