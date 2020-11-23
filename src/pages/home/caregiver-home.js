import React from 'react';
import * as API_PATIENTS from "../patient/api/patient-api";
import * as API_CAREGIVERS from "../caregiver/api/caregiver-api"
import {Alert, Badge, Button, Card, CardHeader, Col, FormGroup, Input, Row} from "reactstrap";
import APIResponseErrorMessage from "../../common/error_handling/api-response-error-message";
import {Link} from "react-router-dom";
import PatientsTable from "../patient/components/patients-table";
import Cookies from "universal-cookie";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {REMOTE_HOST} from "../../common/hosts";

const cookies = new Cookies();

class CaregiverHome extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedPatientChanged = this.handleSelectedPatientChanged.bind(this)
        this.showNotification = this.showNotification.bind(this)

        this.state = {
            patients: [""],
            caregiver: {},
            isPatientsLoaded: false,
            isCaregiverLoaded: false,
            errorStatus: 0,
            error: null,
            selectedPatientId: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie),
            notification: null
        }
    }

    componentDidMount() {
        if (this.state.userType === 'caregiver') {
            const caregiverId = this.state.userId
            this.fetchCaregiver(caregiverId)
            this.fetchPatients()
        }


        let sock = new SockJS(REMOTE_HOST.backend_api + "/notifications")
        let stompClient = Stomp.over(sock)

        sock.onopen = function () {
            console.log("Socket opened")
        }

        let self = this
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/notification', function (message) {
                self.showNotification(message)
            })
        })

    }

    showNotification(message) {

        let tokens = message.body.split(",")
        let patientId = tokens[0]
        let activity = tokens[1]
        let duration = tokens[2]
        let assigned = this.state.caregiver.patients.find(id => id === patientId)

        if (assigned !== null) {

            let patient = this.state.patients.find(patient => patient.id === assigned)

            let text = ""
            switch (activity) {
                case "sleeping":
                    text = "Patient " + patient.name + " has slept for " + duration + " hours!"
                    break;
                case "bathroom":
                    text = "Patient " + patient.name + " was in the bathroom for " + duration + " minutes!"
                    break;
                case "outdoor":
                    text = "Patient " + patient.name + " was outside for " + duration + " hours!"
                    break;

                default:
                    break;
            }
            this.setState(({notification: text}))
        } else {

        }
    }


    fetchPatients() {
        API_PATIENTS.getPatients((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    patients: result,
                    isPatientsLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    fetchCaregiver(caregiverId) {
        return API_CAREGIVERS.getCaregiverById(caregiverId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    caregiver: result,
                    isCaregiverLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleSelectedPatientChanged(event) {
        this.setState({
            selectedPatientId: event.target.value
        })
    }

    handleLogout() {
        cookies.remove('userType')
        cookies.remove('cachedUserType')
        cookies.remove('userId')
        cookies.remove('cachedUserId')
    }

    render() {
        return (
            this.state.userType === 'caregiver' &&
            <div>
                {this.state.isCaregiverLoaded &&
                <CardHeader>

                    <Row>
                        <Col sm={{size: '5', offset: 1}}>
                            <h3><strong> {"Hello, " + this.state.caregiver.name + "!"} </strong>
                            </h3>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <h4><Badge color="warning" size="sm">Caregiver</Badge></h4>
                        </Col>
                        <Col sm={{size: '1', offset: 3}}>
                            <Link to={"/login"}>
                                <Button color="danger" onClick={this.handleLogout}>
                                    Logout
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                </CardHeader>}
                {this.state.isCaregiverLoaded &&
                <Card>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <h5>{"Born " + this.state.caregiver.birthDate + ", living at " + this.state.caregiver.address}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>}

                {this.state.isPatientsLoaded &&
                <CardHeader>
                    <Row>
                        <Col sm={{size: '4', offset: 1}}>
                            <h5>
                                <strong> {"You have " + (this.state.patients.filter((patient) =>
                                    this.state.caregiver.patients.includes(patient.id)).length === 1 ? " one patient:" : this.state.patients.filter((patient) =>
                                    this.state.caregiver.patients.includes(patient.id)).length + " patients:")} </strong>
                            </h5>
                        </Col>
                        <Col sm={{size: '1', offset: 5}}>
                            <h6><Badge color="success" size="sm">Up to date</Badge></h6>
                        </Col>
                    </Row>

                </CardHeader>}

                {this.state.isPatientsLoaded &&
                <Card>
                    {this.state.notification &&
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            <Alert color="danger">
                                {"ALERT: " + this.state.notification}
                            </Alert>
                        </Col>
                    </Row>}
                    <Row>
                        <Col sm={{size: '8', offset: 0}}>
                            <PatientsTable tableData={
                                this.state.patients.filter((patient) =>
                                    this.state.caregiver.patients.includes(patient.id))
                            }/>
                        </Col>
                        <Col sm={{size: '3', offset: 0}} style={{marginTop: "100px"}}>
                            <Link to={"/patients/" + this.state.selectedPatientId}>
                                <Button color="info"
                                        disabled={this.state.selectedPatientId === null}>
                                    View details of patient
                                </Button>
                            </Link>
                            <FormGroup id="patientName">
                                <Input style={{marginTop: "10px"}} type="select" name="patientName"
                                       id="patientNameField"
                                       onChange={this.handleSelectedPatientChanged}>
                                    <option> Select a patient</option>
                                    {this.state.patients.filter((patient) =>
                                        this.state.caregiver.patients.includes(patient.id))
                                        .map(patient =>
                                            <option key={patient.id}
                                                    value={patient.id}>
                                                {patient.name + " : " + patient.gender}
                                            </option>
                                        )}
                                </Input>

                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>}

            </div>
        );
    }

}


export default CaregiverHome;