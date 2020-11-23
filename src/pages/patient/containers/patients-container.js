import React from 'react';
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Card, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import AddPatientForm from "../components/add-patient-form";
import {Link} from 'react-router-dom';

import * as API_PATIENTS from "../api/patient-api"
import PatientsTable from "../components/patients-table";
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const cookies = new Cookies();

class PatientsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.handleSelectedPatientChanged = this.handleSelectedPatientChanged.bind(this);

        this.state = {
            formSelected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedPatientId: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        };
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            this.fetchPatients();
        }
    }

    fetchPatients() {
        return API_PATIENTS.getPatients((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    isLoaded: true,
                    tableData: result
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

    toggleForm() {
        this.setState({formSelected: !this.state.formSelected});
    }


    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchPatients();
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                <CardHeader>
                    <strong> Patient Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 1}}>
                            <Button color="primary"
                                    onClick={this.toggleForm}
                                    size={'lg'}>
                                Add New Patient
                            </Button>
                        </Col>
                        <Col sm={{size: '4', offset: 2}}>
                            <FormGroup id="patientName">
                                <Label for='patientNameField'>
                                    View details, create treatment, or delete Patient:
                                </Label>
                                <Input name="patientNameSelector" id="patientNameField"
                                       type='select'
                                       onChange={this.handleSelectedPatientChanged}>
                                    <option>Select a patient</option>
                                    {this.state.tableData.map(patient =>
                                        <option key={patient.id}
                                                value={patient.id}>
                                            {patient.name + " : " + patient.gender}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <Link to={'/patients/' + this.state.selectedPatientId}>
                                <Button color="success"
                                        size={'lg'}
                                        disabled={this.state.selectedPatientId === null}>
                                    GO
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '12', offset: 0}}>
                            {this.state.isLoaded && <PatientsTable tableData={this.state.tableData}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.formSelected}
                       toggle={this.toggleForm}
                       className={this.props.className}
                       size="lg">
                    <ModalHeader toggle={this.toggleForm}> Add a new Patient </ModalHeader>
                    <ModalBody>
                        <AddPatientForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}


export default PatientsContainer;
