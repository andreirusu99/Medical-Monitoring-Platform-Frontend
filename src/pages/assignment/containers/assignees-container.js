import React from 'react';
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import {Button, Card, CardHeader, Col, FormGroup, Input, Row} from 'reactstrap';

import * as API_PATIENTS from "../../patient/api/patient-api"
import * as API_CAREGIVERS from "../../caregiver/api/caregiver-api"
import AssigneesTable from "../components/assignees-table";
import {Link} from "react-router-dom";
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../commons/hosts";

const cookies = new Cookies();


class AssigneesContainer extends React.Component {

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.handleSelectedAssignPatientChanged = this.handleSelectedAssignPatientChanged.bind(this);
        this.handleSelectedUnAssignPatientChanged = this.handleSelectedUnAssignPatientChanged.bind(this)
        this.handleAssign = this.handleAssign.bind(this)
        this.handleUnAssign = this.handleUnAssign.bind(this)

        this.state = {
            collapseForm: false,
            allPatientsData: [],
            assignedPatientsData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedAssignId: null,
            selectedUnAssignId: null,
            caregiver: {},
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        };
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            const {match: {params}} = this.props
            let initialState = this.state
            initialState.caregiver.id = params.caregiverId
            this.setState(initialState)
            this.fetchCaregiverAndPatients();
        }
    }

    fetchCaregiverAndPatients() {
        API_CAREGIVERS.getCaregiverById(this.state.caregiver.id, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    caregiver: result
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })

        API_PATIENTS.getPatients((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    isLoaded: true,
                    allPatientsData: result
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })

    }

    updateCaregiver(caregiverDTO) {
        return API_CAREGIVERS.updateCaregiver(caregiverDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated caregiver with id: " + result.id);
                this.setState({
                    success: true
                })
                this.reload()
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }


    handleSelectedAssignPatientChanged(event) {
        this.setState({
            selectedAssignId: event.target.value
        })
    }

    handleSelectedUnAssignPatientChanged(event) {
        this.setState({
            selectedUnAssignId: event.target.value
        })
    }

    handleAssign() {
        if (this.state.selectedAssignId !== null) {
            let newPatients = this.state.caregiver.patients
            newPatients.push(this.state.selectedAssignId)
            let caregiverDTO = {
                id: this.state.caregiver.id,
                name: this.state.caregiver.name,
                birthDate: this.state.caregiver.birthDate,
                gender: this.state.caregiver.gender,
                password: this.state.caregiver.password,
                address: this.state.caregiver.address,
                patients: newPatients
            }
            console.log(caregiverDTO)
            this.updateCaregiver(caregiverDTO)
        }
    }

    handleUnAssign() {
        if (this.state.selectedUnAssignId !== null) {
            let newPatients = this.state.caregiver.patients
            let index = newPatients.indexOf(this.state.selectedUnAssignId)
            if (index > -1) {
                newPatients.splice(index, 1)
            }
            let caregiverDTO = {
                id: this.state.caregiver.id,
                name: this.state.caregiver.name,
                birthDate: this.state.caregiver.birthDate,
                gender: this.state.caregiver.gender,
                password: this.state.caregiver.password,
                address: this.state.caregiver.address,
                patients: newPatients

            }
            console.log(caregiverDTO)
            this.updateCaregiver(caregiverDTO)
        }
    }

    reload() {
        this.setState({
            isLoaded: false
        })
        this.fetchCaregiverAndPatients()
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                <CardHeader>
                    <strong> {"Patients assigned to " + this.state.caregiver.name}  </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 1}}>
                            <Button color="primary"
                                    onClick={this.handleAssign}
                                    disabled={this.state.selectedAssignId === null}>
                                Assign
                            </Button>
                        </Col>
                        <Col sm={{size: '3', offset: 0}}>
                            <FormGroup id="patientName">
                                <Input name="patientNameSelector" id="patientNameField"
                                       type='select'
                                       onChange={this.handleSelectedAssignPatientChanged}>
                                    <option>Select a patient to assign</option>
                                    {this.state.allPatientsData.filter((patient) =>
                                        !this.state.caregiver.patients.includes(patient.id)).map(patient =>
                                        <option key={patient.id}
                                                value={patient.id}>
                                            {patient.name + ", " + patient.gender}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={{size: '1', offset: 1}}>
                            <Link to={"/caregivers/" + this.state.caregiver.id}>
                                <Button color="secondary">Back</Button>
                            </Link>
                        </Col>
                        <Col sm={{size: '3', offset: 0}}>
                            <FormGroup id="patientName">
                                <Input name="patientNameSelector" id="patientNameField"
                                       type='select'
                                       onChange={this.handleSelectedUnAssignPatientChanged}>
                                    <option>Select a patient to un-assign</option>
                                    {this.state.allPatientsData.filter((patient) =>
                                        this.state.caregiver.patients.includes(patient.id))
                                        .map(patient =>
                                            <option key={patient.id}
                                                    value={patient.id}>
                                                {patient.name + ", " + patient.gender}
                                            </option>
                                        )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <Button color="danger"
                                    onClick={this.handleUnAssign}
                                    disabled={this.state.selectedUnAssignId === null}>
                                Un-assign</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '12', offset: 0}}>
                            {this.state.isLoaded &&
                            <AssigneesTable tableData={this.state.allPatientsData.filter((patient) =>
                                this.state.caregiver.patients.includes(patient.id))}/>}
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


export default AssigneesContainer;
