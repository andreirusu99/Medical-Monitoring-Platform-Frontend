import React from "react";
import {CardHeader, Row, Card, Col, Button} from "reactstrap";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const {PillBoxServiceClient} = require("../../../proto/generated/PillBox_grpc_web_pb")
const {MedicationPlanRequest} = require("../../../proto/generated/PillBox_pb")

const grpc_client = new PillBoxServiceClient('http://localhost:9191', null, null)

const cookies = new Cookies();

class PillboxContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie),
            time: new Date(),
            medication: []
        }
    }

    getMedicationPlan(patientId) {
        if (!localStorage.getItem("Medication")) {
            // no medication plan downloaded, so download it and save it in local storage

            const request = new MedicationPlanRequest()
            request.setPatientid(patientId)

            grpc_client.downloadMedicationPlan(request, {}, (err, response) => {
                if (response == null) {
                    console.log(err)
                } else {
                    let state = this.state
                    response.getItemsList().forEach(item => {
                        state.medication.push({
                            name: item.getDrugname(),
                            to_take: item.getDosage(),
                            taken: 0
                        })
                    })
                    localStorage.setItem("Medication", JSON.stringify(state.medication))
                    this.setState(state)
                }
            })

        } else {
            // medication plan is already downloaded in storage
            let state = this.state
            JSON.parse(localStorage.getItem("Medication")).forEach(item => {
                state.medication.push({name: item.name, to_take: item.to_take, taken: item.taken})
            })
            localStorage.setItem("Medication", JSON.stringify(state.medication))
            this.setState(state)
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props

        if (params.patientId !== this.state.userId) return

        // display the current time
        this.timer = setInterval(() => {
            let state = this.state
            state['time'] = new Date()
            this.setState(state)
        }, 1000)

        this.getMedicationPlan(params.patientId)

    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleMedicationTaken(takenDrug) {
        console.log(takenDrug.name + " taken")

        let meds = this.state.medication

        meds.forEach(item => {
            if (item.name === takenDrug.name && item.to_take > 0) {
                item.to_take -= 1
                item.taken += 1
            }
        })

        // update state
        let state = this.state
        state.medication = meds
        this.setState(state)

        // update storage
        localStorage.setItem("Medication", JSON.stringify(this.state.medication))
    }

    render() {
        return (
            <div>

                <CardHeader>

                    <Row>

                        <Col style={{float: 'left'}} sm={{size: '1', offset: '1'}}>
                            <Link to={"/patient_home"}>
                                <Button color={"info"}>
                                    {'Home'}
                                </Button>
                            </Link>
                        </Col>

                        <Col style={{fontSize: '22px'}} sm={{size: '3', offset: '3'}}>
                            <strong>{"Pill Box Application"}</strong>
                        </Col>

                        <Col sm={{size: '3', offset: '1'}}>
                            {this.state.time.toString()}
                        </Col>

                    </Row>

                </CardHeader>

                {localStorage.getItem("Medication") && this.state.userType === 'patient' &&
                <Row style={{marginTop: '25px'}}>

                    <Col sm={{size: '4', offset: '1'}}>

                        <CardHeader className={'text-center'}>
                            <strong>{"Medication to take"}</strong>
                        </CardHeader>

                        <Card style={{padding: '15px'}}>

                            {this.state.medication.map(item =>
                                <div key={item.name}
                                     style={{marginTop: '20px', fontSize: '20px'}}>

                                    <strong>{item.name}</strong>

                                    <i>
                                        {" : " + item.taken + " taken, " + item.to_take + " left"}
                                    </i>

                                    <Button color={"success"}
                                            style={{float: 'right'}}
                                            onClick={() => this.handleMedicationTaken(item)}
                                            disabled={item.to_take === 0}>
                                        {"Take"}
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>}

            </div>
        )
    }
}

export default PillboxContainer