import React from "react";
import {CardHeader, Row, Card, Col, Button} from "reactstrap";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";
import {Alert} from "react-bootstrap";

const {PillBoxServiceClient} = require("../../../proto/generated/PillBox_grpc_web_pb")
const {MedicationPlanRequest, MedicationTakenRequest} = require("../../../proto/generated/PillBox_pb")

const grpc_client = new PillBoxServiceClient('http://localhost:9191', null, null)

const cookies = new Cookies();

class PillboxContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie),
            time: new Date(),
            medication: [],
            deadlines: {}
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props

        if (params.patientId !== this.state.userId) return

        // display the current time
        this.timer = setInterval(() => {
            let state = this.state

            let now = new Date()

            if (now.getHours() === 20 && now.getMinutes() === 30 && now.getSeconds() === 15) {
                if (state.deadlines) state.deadlines = []
                state.medication = []
                localStorage.removeItem("Medication")

                this.getMedicationPlan(params.patientId)
                console.log("New medication plan downloaded!")
            }

            state.time = now
            this.computeMedicationTimers()
            this.setState(state)

        }, 1000)

        this.getMedicationPlan(params.patientId)
        this.computeMedicationTimers()

    }

    componentWillUnmount() {
        clearInterval(this.timer)
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
        // compute timers
        this.computeMedicationTimers()
    }

    computeMedicationTimers() {
        let state = this.state

        this.state.medication.forEach((item, index) => {

            if (item.to_take > 0) {
                let intervalSeconds = (24 * 60 * 60 / (item.to_take + item.taken)).toFixed(0)
                let nextDeadline = intervalSeconds * (item.taken + 1)

                let deadline = new Date()
                deadline.setHours(0)
                deadline.setMinutes(0)
                deadline.setSeconds(0)

                deadline.setTime(deadline.getTime() + nextDeadline * 1000 - 1000)

                state.deadlines[item.name] = {}

                state.deadlines[item.name].time = deadline

                state.deadlines[item.name].missed = this.state.time.getTime() > deadline.getTime();

            }
        })
        this.setState(state)
    }

    handleMedicationTaken(takenDrug) {

        let request = new MedicationTakenRequest()
        request.setPatientid(this.state.userId)
        request.setDrugname(takenDrug.name)

        grpc_client.registerMedsTaken(request, {}, (err, response) => {
            if (response == null) {
                console.log(err)
            } else {
                if (response.getAcknowledged()) {
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
                    // localStorage.setItem("Medication", JSON.stringify(this.state.medication))
                }
            }
        })

        // update timers
        this.computeMedicationTimers()
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

                    {this.state.medication.length === 0 &&
                    <Alert color={"danger"}>
                        {"You have no active treatments!"}
                    </Alert>
                    }

                    <Col sm={{size: '5', offset: '3'}}>

                        <CardHeader className={'text-center'} style={{border: '2px solid white'}}>
                            <strong>{"Medication to take"}</strong>
                        </CardHeader>

                        <Card style={{
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            paddingBottom: '15px',
                            border: '2px solid white'
                        }}>

                            {this.state.medication.map(item =>
                                <div key={item.name}
                                     style={{marginTop: '20px', fontSize: '22px'}}>

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

                                    {this.state.deadlines[item.name] && this.state.deadlines[item.name].time && item.to_take > 0 &&
                                    <div color={this.state.deadlines[item.name].missed ? '#de2929' : '#FFFFFF'}>
                                        {"Take by " + this.state.deadlines[item.name].time.toLocaleString().split(", ")[1]}
                                    </div>}
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