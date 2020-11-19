import React from 'react';
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import {Button, Card, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import AddDrugForm from "../components/add-drug-form";
import {Link} from 'react-router-dom';

import * as API_DRUGS from "../api/drug-api"
import DrugsTable from "../components/drugs-table";
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../commons/hosts";

const cookies = new Cookies();


class DrugsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.handleSelectedDrugChanged = this.handleSelectedDrugChanged.bind(this);

        this.state = {
            formSelected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedDrugName: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        };
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            this.fetchDrugs();
        }
    }

    fetchDrugs() {
        return API_DRUGS.getDrugs((result, status, err) => {
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
        this.fetchDrugs();
    }

    handleSelectedDrugChanged(event) {
        this.setState({
            selectedDrugName: event.target.value
        })
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                <CardHeader>
                    <strong> Drug Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 1}}>
                            <Button color="primary"
                                    onClick={this.toggleForm}
                                    size={'lg'}>
                                Add New Drug
                            </Button>
                        </Col>
                        <Col sm={{size: '4', offset: 2}}>
                            <FormGroup id='drugName'>
                                <Label for='drugNameField'>
                                    View details or delete Drug:
                                </Label>
                                <Input name='drugNameSelector' id='drugNameField'
                                       type='select'
                                       value={this.state.selectedDrugName}
                                       onChange={this.handleSelectedDrugChanged}>
                                    <option>Select a drug</option>
                                    {this.state.tableData.map(drug =>
                                        <option key={drug.id}
                                                value={drug.name}>
                                            {drug.name}
                                        </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <Link to={'/drugs/' + this.state.selectedDrugName}>
                                <Button color="success"
                                        size={'lg'}
                                        disabled={this.state.selectedDrugName === null}>
                                    GO
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '12', offset: 0}}>
                            {this.state.isLoaded && <DrugsTable tableData={this.state.tableData}/>}
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
                    <ModalHeader toggle={this.toggleForm}> Add a new Drug </ModalHeader>
                    <ModalBody>
                        <AddDrugForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}


export default DrugsContainer;
