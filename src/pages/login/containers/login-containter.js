import React from 'react';
import {Alert, Button, Card, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import validate from "../../../common/validators/form-validators";
import * as API_LOGIN from "../api/login-api"
import {Link, Redirect} from "react-router-dom";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";


const cookies = new Cookies();

class LoginContainer extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {

            doctors: [],
            caregivers: [],
            patients: [],

            defaultValues: this.props.defaultValues,

            success: false,

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    valid: false,
                    validationRules: {}
                },
                password: {
                    value: '',
                    valid: false,
                    validationRules: {}
                },
                userType: {
                    value: '',
                    valid: false,
                    validationRules: {}
                }
            }
        };
    }

    componentDidMount() {

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
            formIsValid: valid,
            success: false,
            errorStatus: 0,
            error: null,
        });

    };

    attemptLogin(loginDTO) {
        API_LOGIN.attemptLogin(loginDTO, (result, status, error) => {
            if (result !== null && (status === 200)) {
                if (result.userId !== null) {
                    cookies.remove('userType')
                    cookies.remove(REMOTE_HOST.user_type_cookie)
                    cookies.remove('userId')
                    cookies.remove(REMOTE_HOST.user_id_cookie)

                    cookies.set(REMOTE_HOST.user_id_cookie, result.userId, {path: '/'})
                    cookies.set(REMOTE_HOST.user_type_cookie, result.userType, {path: '/'})
                    this.setState({
                        success: true
                    })
                    console.log("Successfully logged in" + result.userType + " with id: " + result.userId);
                }
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        })
    }

    handleSubmit() {
        let loginDTO = {
            name: this.state.formControls.name.value.trim(),
            password: this.state.formControls.password.value.trim(),
            userType: this.state.formControls.userType.value.toLowerCase(),
        }
        console.log(loginDTO)
        this.attemptLogin(loginDTO)
    }

    render() {

        return (
            <div>
                <CardHeader>
                    <Row>
                        <Col sm={{size: '6', offset: 3}}>
                            <h4>
                                {" Please log in using your credentials."}
                            </h4>
                        </Col>
                    </Row>
                </CardHeader>

                <Card>
                    <Row>
                        <Col sm={{size: '4', offset: 3}}>
                            <FormGroup id="name">
                                <Label for="nameField"> Name:</Label>
                                <Input name="name" id="nameField"
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.name.touched ? 1 : 0}
                                       required
                                />
                            </FormGroup>
                            <FormGroup id="password">
                                <Label for="passwordField"> Password:</Label>
                                <Input name="password" id="passwordField" type="password"
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.password.touched ? 1 : 0}
                                       required
                                />
                            </FormGroup>
                            <FormGroup id="userType">
                                <Label for="userTypeField"> I am a:</Label>
                                <Input name="userType" id="userTypeField" type="select"
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.userType.touched ? 1 : 0}
                                       required>
                                    <option>user type</option>
                                    <option>Doctor</option>
                                    <option>Patient</option>
                                    <option>Caregiver</option>
                                </Input>
                            </FormGroup>
                        </Col>

                        <Col sm={{size: '2', offset: 1}} style={{marginTop: "100px"}}>
                            <Button color="success" onClick={this.handleSubmit} disabled={!this.state.formIsValid}>
                                Log In
                            </Button>
                            {this.state.errorStatus > 0 && <Alert color="danger">Error! Check data.</Alert>}
                            {this.state.success && cookies.get(REMOTE_HOST.user_id_cookie) &&
                            <Alert color="success">Success!</Alert> &&
                            <Redirect to={"/" + cookies.get(REMOTE_HOST.user_type_cookie) + "_home"}/>
                            }
                            {cookies.get(REMOTE_HOST.user_id_cookie) && <Alert color="info">Already logged in</Alert>}
                            {cookies.get(REMOTE_HOST.user_id_cookie) &&
                            <Link to={"/" + cookies.get(REMOTE_HOST.user_type_cookie) + "_home"}>
                                <Button color="info">
                                    Proceed
                                </Button>
                            </Link>
                            }
                        </Col>
                    </Row>

                </Card>

            </div>
        )
    };
}

export default LoginContainer
