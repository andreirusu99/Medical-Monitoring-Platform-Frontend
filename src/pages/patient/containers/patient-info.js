import React from 'react';
import * as API_PATIENTS from "../api/patient-api";
import {Button, Card, CardHeader, Col, Row} from "reactstrap";
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import UpdatePatientForm from "../components/update-patient-form";
import {Link} from 'react-router-dom';
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../commons/hosts";

const cookies = new Cookies();

class PatientInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            patient: {},
            isLoaded: false,
            errorStatus: 0,
            error: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        }
    }

    componentDidMount() {
        if (this.state.userType === 'doctor' || this.state.userType === 'caregiver') {
            const {match: {params}} = this.props
            this.fetchPatient(params.patientId)
        }
    }

    fetchPatient(patientId) {
        API_PATIENTS.getPatientById(patientId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    patient: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleDelete() {
        let patientId = this.state.patient.id
        return API_PATIENTS.deletePatient(patientId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    isLoaded: false
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err
                });
            }
        });
    }

    render() {
        return (
            (
                this.state.userType === 'doctor' ||
                this.state.userType === 'caregiver'
            ) &&
            <div>
                {this.state.userType === 'doctor' && <NavigationBar/>}
                <CardHeader>
                    <strong> Patient Details </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 2}}>
                            {this.state.isLoaded && this.state.userType === 'doctor' &&
                            <Link to={'/patients'}>
                                <Button color="danger" onClick={this.handleDelete}>Delete Patient</Button>
                            </Link>
                            }
                        </Col>
                        <Col sm={{size: '1', offset: 2}}>
                            {this.state.isLoaded &&
                            <Link to={'/treatments/of/' + String(this.state.patient.id)}>
                                <Button color="primary">Go to Treatments</Button>
                            </Link>
                            }
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.isLoaded && <UpdatePatientForm
                                defaultValues={this.state.patient}
                            />}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }

}


export default PatientInfo;