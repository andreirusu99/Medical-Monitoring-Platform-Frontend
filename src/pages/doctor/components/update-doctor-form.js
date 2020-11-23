import React from 'react';
import validate from "../../../common/validators/form-validators";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import * as API_DOCTORS from "../../doctor/api/doctor-api";


class UpdateDoctorForm extends React.Component {

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
                age: {
                    enabled: false,
                    valid: true,
                    validationRules: {
                        ageValidator: 18
                    }
                },
                password: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                department: {
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
        initialState.formControls.age.value = this.state.defaultValues.age
        initialState.formControls.password.value = this.state.defaultValues.password
        initialState.formControls.address.value = this.state.defaultValues.address
        initialState.formControls.department.value = this.state.defaultValues.department
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

    updateDoctor(doctorDTO) {
        return API_DOCTORS.updateDoctor(doctorDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated doctor with id: " + result.id);
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
        let doctorDTO = {
            id: this.state.defaultValues.id,
            name: this.state.defaultValues.name,
            age: this.state.formControls.age.value,
            password: this.state.formControls.password.value,
            address: this.state.formControls.address.value,
            department: this.state.formControls.department.value,
        };
        this.updateDoctor(doctorDTO);
    }

    render() {
        return (

            <div>
                <Row>
                    <Col sm={{size: '6', offset: 1}}>
                        <FormGroup id='name'>
                            <Label for='nameField'> Name: </Label>
                            <Input name='name' id='nameField'
                                   defaultValue={this.state.defaultValues.name}
                                   disabled={true}
                            />

                        </FormGroup>

                        <FormGroup id='age'>
                            <Label for='ageField'> Age: </Label>
                            <Input name='age' id='ageField' type="number" min={"18"}
                                   onChange={this.handleChange}
                                   defaultValue={this.state.defaultValues.age}
                                   touched={this.state.formControls.age.touched ? 1 : 0}
                                   valid={this.state.formControls.age.valid}
                                   required
                            />
                            {this.state.formControls.age.touched && !this.state.formControls.age.valid &&
                            <div className={"error-message row"}> * Age not valid </div>}
                        </FormGroup>

                        <FormGroup id='password'>
                            <Label for='passwordField'> Password: </Label>
                            <Input name='password' id='passwordField'
                                   onChange={this.handleChange}
                                   defaultValue={this.state.defaultValues.password}
                                   touched={this.state.formControls.password.touched ? 1 : 0}
                                   valid={this.state.formControls.password.valid}
                                   required
                            />
                            {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                            <div className={"error-message row"}> * Password must have at least 3 characters </div>}
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
                            <div className={"error-message row"}> * Address must have at least 5 characters </div>}
                        </FormGroup>

                        <FormGroup id='department'>
                            <Label for='departmentField'> Department: </Label>
                            <Input name='department' id='departmentField'
                                   onChange={this.handleChange}
                                   defaultValue={this.state.defaultValues.department}
                                   touched={this.state.formControls.address.touched ? 1 : 0}
                                   valid={this.state.formControls.department.valid}
                                   required
                            />
                            {this.state.formControls.department.touched && !this.state.formControls.department.valid &&
                            <div className={"error-message row"}> * department must have at least 3 characters </div>}
                        </FormGroup>
                    </Col>
                    <Col sm={{size: '4', offset: 1}}>
                        <p style={{marginTop: "50px"}}><strong>
                            Please use the navigation controls in the top bar to manage patients, caregivers and
                            medication
                        </strong></p>
                        <Button color="success"
                                onClick={this.handleUpdate}
                                disabled={!this.state.formIsValid}
                                style={{marginTop: "50px"}}>
                            Update Details
                        </Button>
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

export default UpdateDoctorForm;
