import React from 'react';
import validate from "../../../common/validators/form-validators";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import * as API_CAREGIVERS from "../api/caregiver-api";


class UpdateCaregiverForm extends React.Component {

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
                }
            }
        };
    }


    componentDidMount() {
        let initialState = this.state
        initialState.formControls.address.value = this.state.defaultValues.address
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

    updateCaregiver(caregiverDTO) {
        return API_CAREGIVERS.updateCaregiver(caregiverDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated caregiver with id: " + result.id);
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
        let caregiverDTO = {
            id: this.state.defaultValues.id,
            name: this.state.defaultValues.name,
            birthDate: this.state.defaultValues.birthDate,
            gender: this.state.defaultValues.gender,
            password: this.state.defaultValues.password,
            address: this.state.formControls.address.value,
            patients: []
        };

        this.updateCaregiver(caregiverDTO);
    }

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField'
                           defaultValue={this.state.defaultValues.name}
                           disabled={!this.state.formControls.name.enabled}
                    />

                </FormGroup>

                <FormGroup id='birthDate'>
                    <Label for='birthDateField'> Birth Date: </Label>
                    <Input name='birthDate' id='birthDateField'
                           defaultValue={this.state.defaultValues.birthDate}
                           disabled={!this.state.formControls.birthDate.enabled}
                    />
                </FormGroup>

                <FormGroup id='gender'>
                    <Label for='genderField'> Gender: </Label>
                    <Input name='gender' id='genderField'
                           defaultValue={this.state.defaultValues.gender}
                           disabled={!this.state.formControls.name.enabled}
                    />
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField'
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.address}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                    <div className={"error-message row"}> * Address must have at least 3 characters </div>}
                </FormGroup>

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
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        );
    }
}

export default UpdateCaregiverForm;
