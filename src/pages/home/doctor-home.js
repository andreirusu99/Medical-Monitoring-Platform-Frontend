import React from 'react';
import * as API_DOCTORS from "../doctor/api/doctor-api";
import {Badge, Button, Card, CardHeader, Col, Row} from "reactstrap";
import APIResponseErrorMessage from "../../commons/error_handling/api-response-error-message";
import NavigationBar from "../../navigation-bar";
import UpdateDoctorForm from "../doctor/components/update-doctor-form";

import Cookies from "universal-cookie";
import {Link} from "react-router-dom";
import {REMOTE_HOST} from "../../commons/hosts";

const cookies = new Cookies();

class DoctorHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            doctor: {},
            isDoctorLoaded: false,
            errorStatus: 0,
            error: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        }
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            this.fetchDoctor(this.state.userId)
        }
    }

    fetchDoctor(doctorId) {
        return API_DOCTORS.getDoctorById(doctorId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    doctor: result,
                    isDoctorLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleLogout() {
        cookies.remove('userType')
        cookies.remove('cachedUserType')
        cookies.remove('userId')
        cookies.remove('cachedUserId')
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                {this.state.isDoctorLoaded &&
                <CardHeader>

                    <Row>
                        <Col sm={{size: '5', offset: 1}}>
                            <h3><strong> {"Hello, " + this.state.doctor.name + "!"} </strong>
                            </h3>
                        </Col>
                        <Col sm={{size: '1', offset: 0}}>
                            <h4><Badge color="info" size="sm">Doctor</Badge></h4>
                        </Col>
                        <Col sm={{size: '1', offset: 3}}>
                            <Link to={"/login"}>
                                <Button color="danger" onClick={this.handleLogout}>
                                    Logout
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                </CardHeader>}
                {this.state.isDoctorLoaded &&
                <Card>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <h5>{this.state.doctor.age + " years old, living at " + this.state.doctor.address}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>}

                {this.state.isDoctorLoaded &&
                <CardHeader>

                    <Row>
                        <Col sm={{size: '5', offset: 1}}>
                            <h6><strong> {"You can find your details below:"} </strong>
                            </h6>
                        </Col>
                        <Col sm={{size: '1', offset: 4}}>
                            <h6><Badge color="success" size="sm">Up to date</Badge></h6>
                        </Col>
                    </Row>

                </CardHeader>}
                {this.state.isDoctorLoaded &&
                <Card>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <UpdateDoctorForm defaultValues={this.state.doctor}/>
                        </Col>
                    </Row>

                </Card>}

            </div>
        );
    }

}


export default DoctorHome;