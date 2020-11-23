import React from 'react';
import validate from "../../../common/validators/form-validators";
import Button from "react-bootstrap/Button";
import * as API_DRUGS from "../api/drug-api";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Col, FormGroup, Input, Label, Row} from "reactstrap";


class AddDrugForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'The drug\'s name',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                sideEffects: {
                    value: '',
                    placeholder: 'List some side effects of the drug',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                dosage: {
                    value: '',
                    placeholder: 'The daily dosage that should be taken',
                    valid: false,
                    touched: false,
                    validationRules: {
                        numberValidator: 0,
                        isRequired: true
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

    registerDrug(drugDTO) {
        return API_DRUGS.insertDrug(drugDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted drug with id: " + result);
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
        let patientDTO = {
            name: this.state.formControls.name.value,
            sideEffects: this.state.formControls.sideEffects.value,
            dosage: this.state.formControls.dosage.value,
        };

        console.log(patientDTO);
        this.registerDrug(patientDTO);
    }

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField'
                           placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched ? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='sideEffects'>
                    <Label for='sideEffectsField'> Side Effects: </Label>
                    <Input name='sideEffects' id='sideEffectsField'
                           placeholder={this.state.formControls.sideEffects.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.sideEffects.value}
                           touched={this.state.formControls.sideEffects.touched ? 1 : 0}
                           valid={this.state.formControls.sideEffects.valid}
                           required
                    />
                    {this.state.formControls.sideEffects.touched && !this.state.formControls.sideEffects.valid &&
                    <div className={"error-message row"}> * Side effects too short </div>}
                </FormGroup>

                <FormGroup id='dosage'>
                    <Label for='dosageField'> Dosage: </Label>
                    <Input type="number" name='dosage' id='dosageField'
                           min='1'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.dosage.value}
                           touched={this.state.formControls.dosage.touched ? 1 : 0}
                           valid={this.state.formControls.dosage.valid}
                           required/>
                    {this.state.formControls.dosage.touched && !this.state.formControls.dosage.valid &&
                    <div className={"error-message row"}> * Dosage should be between 1 and 10 </div>}
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

export default AddDrugForm;
