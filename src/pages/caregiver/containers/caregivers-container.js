import React from 'react';
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import {Button, Card, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import AddCaregiverForm from "../components/add-caregiver-form";
import {Link} from 'react-router-dom';

import * as API_CAREGIVERS from "../api/caregiver-api"
import CaregiversTable from "../components/caregivers-table";
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../commons/hosts";

const cookies = new Cookies();


class CaregiverContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.handleSelectedCaregiverChanged = this.handleSelectedCaregiverChanged.bind(this);

        this.state = {
            formSelected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedCaregiverId: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        };
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            this.fetchCaregivers();
        }
    }

    fetchCaregivers() {
        return API_CAREGIVERS.getCaregivers((result, status, err) => {
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
        this.fetchCaregivers();
    }

    handleSelectedCaregiverChanged(event) {
        this.setState({
            selectedCaregiverId: event.target.value
        })
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                <CardHeader>
                    <strong> Caregiver Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 1}}>
                            <Button color="primary"
                                    onClick={this.toggleForm}
                                    size={'lg'}>
                                Add New Caregiver
                            </Button>
                        </Col>
                        <Col sm={{size: '4', offset: 2}}>
                            <FormGroup id="caregiverName">
                                <Label for='caregiverNameField'>
                                    View details and patients or delete Caregiver:
                                </Label>
                                <Input name="caregiverNameSelector" id="caregiverNameField"
                                       type='select'
                                       value={this.state.selectedCaregiverId}
                                       onChange={this.handleSelectedCaregiverChanged}>
                                    <option>Select a caregiver</option>
                                    {this.state.tableData.map(caregiver =>
                                        <option key={caregiver.id}
                                                value={caregiver.id}>
                                            {caregiver.name}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <Link to={'/caregivers/' + this.state.selectedCaregiverId}>
                                <Button color="success"
                                        size={'lg'}
                                        disabled={this.state.selectedCaregiverId === null}>
                                    GO
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '12', offset: 0}}>
                            {this.state.isLoaded && <CaregiversTable tableData={this.state.tableData}/>}
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
                    <ModalHeader toggle={this.toggleForm}> Add a new Caregiver </ModalHeader>
                    <ModalBody>
                        <AddCaregiverForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}


export default CaregiverContainer;
