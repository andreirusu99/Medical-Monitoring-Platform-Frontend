import {REMOTE_HOST} from '../../../commons/hosts';
import RestApiClient from "../../../commons/api/rest-client";


const endpoint = {
    patient: '/patient'
};

function getPatients(callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.patient, {
        method: 'GET',
        credentials: 'include',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPatientById(patientId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.patient + "/get/" + patientId, {
        method: 'GET',
        credentials: 'include',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertPatient(patientDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.patient, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(patientDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updatePatient(patientDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.patient, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(patientDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePatient(patientId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.patient + "/delete/" + patientId, {
        method: 'DELETE',
        credentials: 'include',
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getPatients,
    getPatientById,
    insertPatient,
    updatePatient,
    deletePatient
};
