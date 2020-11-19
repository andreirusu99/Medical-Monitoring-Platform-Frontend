import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import DoctorHome from './pages/home/doctor-home';
import PatientsContainer from './pages/patient/containers/patients-container'
import PatientInfo from './pages/patient/containers/patient-info'

import ErrorPage from './commons/error_handling/error-page';
import styles from './commons/styles/project-style.css';
import DrugsContainer from "./pages/drug/containers/drugs-container";
import DrugInfo from "./pages/drug/containers/drug-info";
import CaregiverContainer from "./pages/caregiver/containers/caregivers-container";
import CaregiverInfo from "./pages/caregiver/containers/caregiver-info";
import TreatmentsContainer from "./pages/treatment/containers/treatments-container";
import TreatmentInfo from "./pages/treatment/containers/treatment-info";
import AssigneesContainer from "./pages/assignment/containers/assignees-container";
import LoginContainer from "./pages/login/containers/login-containter";
import CaregiverHome from "./pages/home/caregiver-home";
import PatientHome from "./pages/home/patient-home";

class App extends React.Component {


    render() {

        return (
            <div className={styles.back}>
                <Router>
                    <div>

                        <Switch>

                            <Route exact path='/' render={() => <LoginContainer/>}/>

                            <Route exact path='/login' render={() => <LoginContainer/>}/>

                            <Route exact path='/doctor_home' render={() => <DoctorHome/>}/>

                            <Route exact path='/caregiver_home' render={() => <CaregiverHome/>}/>

                            <Route exact path='/patient_home' render={() => <PatientHome/>}/>

                            <Route exact path='/patients' render={() => <PatientsContainer/>}/>

                            <Route exact path='/patients/:patientId' component={PatientInfo}/>

                            <Route exact path='/drugs' render={() => <DrugsContainer/>}/>

                            <Route exact path='/drugs/:drugName' component={DrugInfo}/>

                            <Route exact path='/caregivers' render={() => <CaregiverContainer/>}/>

                            <Route exact path='/caregivers/:caregiverId' component={CaregiverInfo}/>

                            <Route exact path='/treatments/of/:patientId' component={TreatmentsContainer}/>

                            <Route exact path='/treatments/:treatmentId' component={TreatmentInfo}/>

                            <Route exact path='/caregivers/assignedTo/:caregiverId' component={AssigneesContainer}/>

                            {/*Error*/}
                            <Route exact path='/error' render={() => <ErrorPage/>}/>

                            <Route render={() => <ErrorPage/>}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    };
}

export default App
