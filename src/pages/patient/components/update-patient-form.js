import React from 'react';
import validate from "../../../commons/validators/form-validators";
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import * as API_PATIENTS from "../api/patient-api";
import Cookies from "universal-cookie";

const cookies = new Cookies();


class UpdatePatientForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.state = {

            defaultValues: this.props.defaultValues,

            success: false,

            errorStatus: 0,
            error: null,

            formIsValid: true,

            userType: cookies.get('cachedUserType'),

            formControls: {
                name: {
                    enabled: false,
                    valid: true,
                    validationRules: {}
                },
                birthDate: {
                    enabled: false,
                    valid: true,
                    validationRules: {}
                },
                gender: {
                    enabled: false,
                    valid: true,
                    validationRules: {}
                },
                address: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                record: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
            }
        };
    }


    componentDidMount() {
        let initialState = this.state
        initialState.formControls.address.value = this.state.defaultValues.address
        initialState.formControls.address.valid = (this.state.userType === 'doctor')
        initialState.formControls.record.value = this.state.defaultValues.record
        initialState.formControls.record.valid = (this.state.userType === 'doctor')
        this.setState(initialState)
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

        let valid = true;
        for (let updatedFormElementName in updatedControls) {
            valid = valid && updatedControls[updatedFormElementName].valid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: valid
        });

    };

    updatePatient(patientDTO) {
        return API_PATIENTS.updatePatient(patientDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated patient with id: " + result.id);
                this.setState({
                    success: true
                })
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleUpdate() {
        let patientDTO = {
            id: this.state.defaultValues.id,
            name: this.state.defaultValues.name,
            birthDate: this.state.defaultValues.birthDate,
            gender: this.state.defaultValues.gender,
            password: this.state.defaultValues.password,
            address: this.state.formControls.address.value,
            record: this.state.formControls.record.value
        };

        this.updatePatient(patientDTO);
    }

    render() {
        return (

            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField'
                           defaultValue={this.state.defaultValues.name}
                           disabled={!this.state.formControls.name.enabled || !(this.state.userType === 'doctor')}
                    />

                </FormGroup>

                <FormGroup id='birthDate'>
                    <Label for='birthDateField'> Birth Date: </Label>
                    <Input name='birthDate' id='birthDateField'
                           defaultValue={this.state.defaultValues.birthDate}
                           disabled={!this.state.formControls.birthDate.enabled || !(this.state.userType === 'doctor')}
                    />
                </FormGroup>

                <FormGroup id='gender'>
                    <Label for='genderField'> Gender: </Label>
                    <Input name='gender' id='genderField'
                           defaultValue={this.state.defaultValues.gender}
                           disabled={!this.state.formControls.name.enabled || !(this.state.userType === 'doctor')}
                    />
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField'
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.address}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           disabled={!(this.state.userType === 'doctor')}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                    <div className={"error-message row"}> * Address must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='record'>
                    <Label for='recordField'> Record: </Label>
                    <Input name='record' id='recordField'
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.record}
                           touched={this.state.formControls.record.touched ? 1 : 0}
                           valid={this.state.formControls.record.valid}
                           disabled={!(this.state.userType === 'doctor')}
                           required
                    />
                    {this.state.formControls.record.touched && !this.state.formControls.record.valid &&
                    <div className={"error-message row"}> * Record must have at least 3 characters </div>}
                </FormGroup>

                {this.state.userType === 'doctor' &&
                <Row>
                    <Col sm={{size: '1', offset: 4}}>
                        <Button color="success"
                                onClick={this.handleUpdate}
                                disabled={!this.state.formIsValid}>
                            Update Details
                        </Button>
                    </Col>
                    <Col sm={{size: '3', offset: 4}}>
                        {this.state.success && <div>Update successful</div>}
                    </Col>
                </Row>}

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        );
    }
}

export default UpdatePatientForm;
