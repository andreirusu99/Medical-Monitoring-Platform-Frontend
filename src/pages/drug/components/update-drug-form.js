import React from 'react';
import validate from "../../../common/validators/form-validators";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import * as API_DRUGS from "../api/drug-api";


class UpdateDrugForm extends React.Component {

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
                sideEffects: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                dosage: {
                    value: '',
                    valid: true,
                    touched: false,
                    validationRules: {
                        numberValidator: 0,
                        isRequired: true
                    }
                },
            }
        };
    }


    componentDidMount() {
        let initialState = this.state
        initialState.formControls.sideEffects.value = this.state.defaultValues.sideEffects
        initialState.formControls.dosage.value = this.state.defaultValues.dosage
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

    updateDrug(drugDTO) {
        return API_DRUGS.updateDrug(drugDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated drug with id: " + result.id);
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
        let drugDTO = {
            id: this.state.defaultValues.id,
            name: this.state.defaultValues.name,
            sideEffects: this.state.formControls.sideEffects.value,
            dosage: this.state.formControls.dosage.value
        };

        this.updateDrug(drugDTO);
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

                <FormGroup id='sideEffects'>
                    <Label for='sideEffectsField'> sideEffects: </Label>
                    <Input name='sideEffects' id='sideEffectsField'
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.sideEffects}
                           touched={this.state.formControls.sideEffects.touched ? 1 : 0}
                           valid={this.state.formControls.sideEffects.valid}
                           required
                    />
                    {this.state.formControls.sideEffects.touched && !this.state.formControls.sideEffects.valid &&
                    <div className={"error-message row"}> * Side effects too short </div>}
                </FormGroup>

                <FormGroup id='dosage'>
                    <Label for='dosageField'> dosage: </Label>
                    <Input name='dosage' id='dosageField'
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.dosage}
                           touched={this.state.formControls.dosage.touched ? 1 : 0}
                           valid={this.state.formControls.dosage.valid}
                           required
                    />
                    {this.state.formControls.dosage.touched && !this.state.formControls.dosage.valid &&
                    <div className={"error-message row"}> * Dosage should be between 1 and 10 </div>}
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

export default UpdateDrugForm;
