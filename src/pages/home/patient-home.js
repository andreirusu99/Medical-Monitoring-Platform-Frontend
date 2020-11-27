import React from 'react';
import * as API_PATIENTS from "../patient/api/patient-api";
import * as API_TREATMENTS from "../treatment/api/treatment-api"
import {Badge, Button, Card, CardHeader, Col, FormGroup, Input, Row} from "reactstrap";
import APIResponseErrorMessage from "../../common/error_handling/api-response-error-message";
import TreatmentsTable from "../treatment/components/treatments-table";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../common/hosts";

const cookies = new Cookies();

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTreatmentChanged = this.handleSelectedTreatmentChanged.bind(this)

        this.state = {
            patient: {},
            treatments: [],
            isPatientLoaded: false,
            isTreatmentsLoaded: false,
            errorStatus: 0,
            error: null,
            selectedTreatmentId: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        }
    }

    componentDidMount() {
        if (this.state.userType === 'patient') {
            const patientId = this.state.userId
            this.fetchPatient(patientId)
            this.fetchTreatments(patientId)
        }
    }

    fetchPatient(patientId) {
        return API_PATIENTS.getPatientById(patientId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    patient: result,
                    isPatientLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    fetchTreatments(patientId) {
        return API_TREATMENTS.getTreatmentsOfPatient(patientId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    treatments: result,
                    isTreatmentsLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleSelectedTreatmentChanged(event) {
        this.setState({
            selectedTreatmentId: event.target.value
        })
    }

    handleLogout() {
        cookies.remove('userType')
        cookies.remove(REMOTE_HOST.user_type_cookie)
        cookies.remove('userId')
        cookies.remove(REMOTE_HOST.user_id_cookie)
    }

    render() {

        return (

            this.state.userType === 'patient' &&
            <div>
                {this.state.isPatientLoaded &&
                <CardHeader>

                    <Row>
                        <Col sm={{size: '5', offset: 1}}>
                            <h3><strong> {"Hello, " + this.state.patient.name + "!"} </strong>
                            </h3>
                        </Col>

                        <Col sm={{size: '1', offset: 0}}>
                            <h4><Badge color="primary" size="sm">Patient</Badge></h4>
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
                {this.state.isPatientLoaded &&
                <Card>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <h5>{"Born " + this.state.patient.birthDate + ", living at " + this.state.patient.address}</h5>
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

                {this.state.isTreatmentsLoaded &&
                <CardHeader>
                    <Row>
                        <Col sm={{size: '4', offset: 1}}>
                            <h5>
                                <strong> {"You have " + (this.state.treatments.length === 1 ? " one treatment:" : this.state.treatments.length + " treatments:")} </strong>
                            </h5>
                        </Col>
                        <Col sm={{size: '1', offset: 5}}>
                            <h6><Badge color="success" size="sm">Up to date</Badge></h6>
                        </Col>
                    </Row>

                </CardHeader>}

                {this.state.isTreatmentsLoaded &&
                <Card>
                    <Row>
                        <Col sm={{size: '6', offset: 1}}>
                            <TreatmentsTable tableData={this.state.treatments}/>
                        </Col>
                        <Col sm={{size: '3.5', offset: 1}} style={{marginTop: "100px"}}>
                            <Link to={"/treatments/" + this.state.selectedTreatmentId}>
                                <Button color="info"
                                        disabled={this.state.selectedTreatmentId === null}>
                                    View medication
                                </Button>
                            </Link>

                            <FormGroup id="patientName">
                                <Input style={{marginTop: "10px"}} type="select" name="patientName"
                                       id="patientNameField"
                                       onChange={this.handleSelectedTreatmentChanged}>
                                    <option> Select a treatment</option>
                                    {this.state.treatments.map(treatment =>
                                        <option key={treatment.id}
                                                value={treatment.id}>
                                            {"From " + treatment.startDate + ' to ' + treatment.endDate}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>

                            <Link to={"/pillbox/" + this.state.patient.id}>
                                <Button color="success" size={"lg"} style={{marginTop: '20px'}}>
                                    {"Pill Box Application"}
                                </Button>
                            </Link>
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


export default PatientHome;