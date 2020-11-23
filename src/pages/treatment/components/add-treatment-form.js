import React from 'react';
import validate from "../../../common/validators/form-validators";
import Button from "react-bootstrap/Button";
import * as API_TREATMENTS from "../api/treatment-api";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Col, FormGroup, Input, Label, Row} from "reactstrap";


class AddTreatmentForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            patientId: this.props.patientId,

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {

                startDate: {
                    value: '',
                    placeholder: 'The treatment\'s start date',
                    valid: false,
                    touched: false,
                    validationRules: {
                        dateValidator: true
                    }
                },
                endDate: {
                    value: '',
                    placeholder: 'The treatment\'s end date',
                    valid: false,
                    touched: false,
                    validationRules: {
                        dateValidator: true
                    }
                },
            }
        };
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});

    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    registerTreatment(treatmentDTO) {
        return API_TREATMENTS.insertTreatment(treatmentDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted treatment with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        let treatmentDTO = {
            patientId: this.state.patientId,
            startDate: this.state.formControls.startDate.value,
            endDate: this.state.formControls.endDate.value,
            dosage: {}
        };

        console.log(treatmentDTO);
        this.registerTreatment(treatmentDTO);
    }

    render() {
        return (
            <div>

                <FormGroup id='startDate'>
                    <Label for='startDateField'> Start Date: </Label>
                    <Input name='startDate' id='startDateField'
                           placeholder={this.state.formControls.startDate.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.startDate.value}
                           touched={this.state.formControls.startDate.touched ? 1 : 0}
                           valid={this.state.formControls.startDate.valid}
                           required
                    />
                    {this.state.formControls.startDate.touched && !this.state.formControls.startDate.valid &&
                    <div className={"error-message row"}> * Start date not valid </div>}
                </FormGroup>

                <FormGroup id='endDate'>
                    <Label for='endDateField'> End Date: </Label>
                    <Input name='endDate' id='endDateField'
                           placeholder={this.state.formControls.endDate.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.endDate.value}
                           touched={this.state.formControls.endDate.touched ? 1 : 0}
                           valid={this.state.formControls.endDate.valid}
                           required
                    />
                    {this.state.formControls.endDate.touched && !this.state.formControls.endDate.valid &&
                    <div className={"error-message row"}> * End date not valid </div>}

                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid}
                                onClick={this.handleSubmit}> Submit </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        );
    }
}

export default AddTreatmentForm;
