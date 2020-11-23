import React from 'react';
import * as API_DRUGS from "../api/drug-api";
import {Button, Card, CardHeader, Col, Row} from "reactstrap";
import APIResponseErrorMessage from "../../../common/error_handling/api-response-error-message";
import UpdateDrugForm from "../components/update-drug-form";
import {Link} from 'react-router-dom';
import NavigationBar from "../../../navigation-bar";
import Cookies from "universal-cookie";
import {REMOTE_HOST} from "../../../common/hosts";

const cookies = new Cookies();

class DrugInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            drug: {},
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
            this.fetchDrug(params.drugName)
        }
    }

    fetchDrug(drugName) {
        API_DRUGS.getDrugByName(drugName, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    drug: result,
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
        let drugName = this.state.drug.name
        console.log(drugName)
        return API_DRUGS.deleteDrug(drugName, (result, status, err) => {
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
                    <strong> Drug Details </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.isLoaded &&
                            <Link to={'/drugs'}>
                                <Button color="danger" onClick={this.handleDelete}>Delete Drug</Button>
                            </Link>
                            }
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '5', offset: 2}}>
                            {this.state.isLoaded && <UpdateDrugForm
                                defaultValues={this.state.drug}
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


export default DrugInfo;