import React from 'react';
import validate from "../../../common/validators/form-validators";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";
import * as API_TREATMENTS from "../api/treatment-api";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const cookies = new Cookies();


class UpdateTreatmentForm extends React.Component {

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

            userType: cookies.get(REMOTE_HOST.user_type_cookie),

            formControls: {
                startDate: {
                    value: '',
                    enabled: true,
                    valid: true,
                    touched: false,
                    validationRules: {
                        dateValidator: true
                    }
                },
                endDate: {
                    value: '',
                    enabled: true,
                    valid: true,
                    touched: false,
                    validationRules: {
                        dateValidator: true
                    }
                },
                drugs: {
                    value: '',
                    enabled: true,
                    valid: true,
                    touched: false,
                    validationRules: {}
                }
            }
        };
    }

    componentDidMount() {
        let initialState = this.state
        initialState.formControls.startDate.value = this.state.defaultValues.startDate
        initialState.formControls.endDate.value = this.state.defaultValues.endDate

        for (let drugName in initialState.defaultValues.dosage) {
            initialState.formControls.drugs.value += drugName + ": " + initialState.defaultValues.dosage[drugName] + '\n'
        }
        console.log(initialState)

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

    updateTreatment(treatmentDTO) {
        return API_TREATMENTS.updateTreatment(treatmentDTO, (result, status, error) => {
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
        let drugsText = ""

        // parse the text in the TextArea to produce
        // a JSON object with drugs and associated dosages
        this.state.formControls.drugs.value.split("\n").map((line) =>
            line.split(":").map((element, index) => {
                if (index === 0 && element.length > 0) {
                    drugsText += '"' + element.trim() + '":'
                } else if (index === 1) {
                    drugsText += element.trim() + ","
                }
                return true
            })
        )
        drugsText = drugsText.slice(0, -1)
        drugsText = '{' + drugsText + '}'

        let treatmentDTO = {
            id: this.state.defaultValues.id,
            patientId: this.state.defaultValues.patientId,
            startDate: this.state.formControls.startDate.value,
            endDate: this.state.formControls.endDate.value,
            dosage: JSON.parse(drugsText)
        };
        console.log(treatmentDTO)
        this.updateTreatment(treatmentDTO);
    }

    render() {
        return (
            <div>

                <FormGroup id='startDate'>
                    <Label for='startDateField'> Start Date: </Label>
                    <Input name='startDate' id='startDateField'
                           required
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.startDate}
                           disabled={!this.state.formControls.startDate.enabled || !(this.state.userType === 'doctor')}
                           touched={this.state.formControls.startDate.touched ? 1 : 0}
                    />
                    {this.state.formControls.startDate.touched && !this.state.formControls.startDate.valid &&
                    <div className={"error-message row"}> * Start date not valid </div>}
                </FormGroup>

                <FormGroup id='endDate'>
                    <Label for='endDateField'> End Date: </Label>
                    <Input name='endDate' id='endDateField'
                           required
                           onChange={this.handleChange}
                           defaultValue={this.state.defaultValues.endDate}
                           disabled={!this.state.formControls.endDate.enabled || !(this.state.userType === 'doctor')}
                           touched={this.state.formControls.endDate.touched ? 1 : 0}
                    />
                    {this.state.formControls.endDate.touched && !this.state.formControls.endDate.valid &&
                    <div className={"error-message row"}> * End date not valid </div>}
                </FormGroup>

                <FormGroup id='drugs'>
                    <Label for='drugsField'> Drugs: [name: daily
                        intake]{this.state.userType === 'doctor' && ", one per row"} </Label>
                    <Input name='drugs' id='drugsField' type="textarea"
                           style={{height: "120px"}}
                           required
                           value={this.state.formControls.drugs.value}
                           onChange={this.handleChange}
                           disabled={!this.state.formControls.drugs.enabled || !(this.state.userType === 'doctor')}
                           touched={this.state.formControls.drugs.touched ? 1 : 0}/>
                    {this.state.formControls.drugs.touched && !this.state.formControls.drugs.valid &&
                    <div className={"error-message row"}> * End date not valid </div>}
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

export default UpdateTreatmentForm;
