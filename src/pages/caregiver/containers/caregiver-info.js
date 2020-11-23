import React from 'react';
import * as API_CAREGIVERS from "../api/caregiver-api";
import {Button, Card, CardHeader, Col, Row} from "reactstrap";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import UpdateCaregiverForm from "../components/update-caregiver-form";
import {Link} from 'react-router-dom';
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const cookies = new Cookies();

class CaregiverInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            caregiver: {},
            isLoaded: false,
            errorStatus: 0,
            error: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        }
    }

    componentDidMount() {
        if (this.state.userType === 'doctor') {
            const {match: {params}} = this.props
            this.fetchCaregiver(params.caregiverId)
        }
    }

    fetchCaregiver(caregiverId) {
        API_CAREGIVERS.getCaregiverById(caregiverId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    caregiver: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleDelete() {
        let caregiverId = this.state.caregiver.id
        return API_CAREGIVERS.deleteCaregiver(caregiverId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    isLoaded: false
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err
                });
            }
        });
    }

    render() {
        return (
            this.state.userType === 'doctor' &&
            <div>
                <NavigationBar/>
                <CardHeader>
                    <strong> Caregiver Details </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '1', offset: 2}}>
                            {this.state.isLoaded &&
                            <Link to={'/caregivers'}>
                                <Button color="danger" onClick={this.handleDelete}>Delete Caregiver</Button>
                            </Link>
                            }
                        </Col>
                        <Col sm={{size: '1', offset: 2}}>
                            {this.state.isLoaded &&
                            <Link to={'/caregivers/assignedTo/' + this.state.caregiver.id}>
                                <Button color="primary">See assigned patients</Button>
                            </Link>
                            }
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.isLoaded && <UpdateCaregiverForm
                                defaultValues={this.state.caregiver}
                            />}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />}
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }

}


export default CaregiverInfo;