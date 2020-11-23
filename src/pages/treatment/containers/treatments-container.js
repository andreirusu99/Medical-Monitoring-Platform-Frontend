import React from 'react';
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Card, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row,} from 'reactstrap';
import {Link} from 'react-router-dom';

import * as API_TREATMENTS from "../api/treatment-api"
import TreatmentsTable from "../components/treatments-table";
import AddTreatmentForm from "../components/add-treatment-form";
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const cookies = new Cookies();


class TreatmentsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.handleSelectedTreatmentChanged = this.handleSelectedTreatmentChanged.bind(this);

        this.state = {
            formSelected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedTreatmentId: null,
            patientId: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        };
    }

    componentDidMount() {
        const {match: {params}} = this.props
        this.setState({
            patientId: params.patientId
        })
        this.fetchTreatments(params.patientId);
    }

    fetchTreatments(patientId) {
        return API_TREATMENTS.getTreatmentsOfPatient(patientId, (result, status, err) => {
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

    toggleForm() {
        this.setState({formSelected: !this.state.formSelected});
    }


    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchTreatments();
    }

    handleSelectedTreatmentChanged(event) {
        this.setState({
            selectedTreatmentId: event.target.value
        })
    }

    render() {
        // console.log(this.state)
        return (
            this.state.userType !== 'patient' &&
            <div>
                {this.state.userType === 'doctor' && <NavigationBar/>}
                <CardHeader>
                    <strong> Treatment Management </strong>
                </CardHeader>
                <Card>
                    <br/>

                    <Row>
                        {this.state.userType === 'doctor' &&
                        <Col sm={{size: '1', offset: 2}}>
                            <Button color="primary"
                                    onClick={this.toggleForm}
                                    size={'lg'}>
                                Add New Treatment
                            </Button>
                        </Col>}
                        {(this.state.userType === 'doctor' || this.state.userType === 'caregiver') &&
                        <Col sm={{size: '3', offset: 2}}>
                            <FormGroup id="treatmentIndex">
                                <Label for='treatmentIndexField'>
                                    {this.state.userType === 'doctor' ?
                                        "Modify or delete Treatment:" : "View Treatment drugs"}
                                </Label>
                                <Input name="treatmentIndexSelector" id="treatmentIndexField"
                                       type='select'
                                       onChange={this.handleSelectedTreatmentChanged}>
                                    <option>Select a treatment</option>
                                    {this.state.tableData.map((treatment) =>
                                        <option key={treatment.id}
                                                value={treatment.id}>
                                            {"From " + treatment.startDate + ' to ' + treatment.endDate}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>}
                        <Col sm={{size: '1', offset: 0}}>
                            <Link to={'/treatments/' + this.state.selectedTreatmentId}>
                                <Button color="success"
                                        size={'lg'}
                                        disabled={this.state.selectedTreatmentId === null}>
                                    GO
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            {this.state.isLoaded && <TreatmentsTable tableData={this.state.tableData}/>}
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
                    <ModalHeader toggle={this.toggleForm}> Add a new Treatment for this Patient </ModalHeader>
                    <ModalBody>
                        <AddTreatmentForm
                            patientId={this.state.patientId}
                            reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}


export default TreatmentsContainer;
