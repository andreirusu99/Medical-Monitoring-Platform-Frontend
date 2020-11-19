import React from 'react';
import * as API_TREATMENTS from "../api/treatment-api";
import {Button, Card, CardHeader, Col, Row} from "reactstrap";
import APIResponseErrorMessage from "../../../commons/error_handling/api-response-error-message";
import UpdateTreatmentForm from "../components/update-treatment-form";
import {Link} from 'react-router-dom';
import Cookies from "universal-cookie";
import NavigationBar from "../../../navigation-bar";
import {REMOTE_HOST} from "../../../commons/hosts";

const cookies = new Cookies();

class TreatmentInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            treatment: {},
            isLoaded: false,
            errorStatus: 0,
            error: null,
            userType: cookies.get(REMOTE_HOST.user_type_cookie),
            userId: cookies.get(REMOTE_HOST.user_id_cookie)
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props
        this.fetchTreatment(params.treatmentId)
    }

    fetchTreatment(treatmentId) {
        API_TREATMENTS.getTreatmentById(treatmentId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    treatment: result,
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
        let treatmentId = this.state.treatment.id
        return API_TREATMENTS.deleteTreatment(treatmentId, (result, status, err) => {
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
            <div>
                {this.state.userType === 'doctor' && <NavigationBar/>}
                <CardHeader>
                    <strong> Treatment Details </strong>
                </CardHeader>
                <Card>
                    <br/>
                    {this.state.userType === 'doctor' && this.state.isLoaded &&
                    <Row>
                        <Col sm={{size: '1', offset: 2}}>
                            <Link to={'/treatments/of/' + String(this.state.treatment.patientId)}>
                                <Button color="danger" onClick={this.handleDelete}>Delete Treatment</Button>
                            </Link>
                        </Col>
                        <Col sm={{size: '1', offset: 2}}>
                            <Link to={'/drugs'}>
                                <Button color="info">View Drugs</Button>
                            </Link>
                        </Col>
                        <Col sm={{size: '1', offset: 2}}>
                            {this.state.isLoaded && this.state.userType === 'doctor' &&
                            <Link to={'/treatments/of/' + String(this.state.treatment.patientId)}>
                                <Button color="secondary">Back</Button>
                            </Link>
                            }
                        </Col>

                    </Row>}
                    <br/>
                    <Row>
                        <Col sm={{size: '5', offset: 3}}>
                            {this.state.isLoaded && <UpdateTreatmentForm
                                defaultValues={this.state.treatment}
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

export default TreatmentInfo;