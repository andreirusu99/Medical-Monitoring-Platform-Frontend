import {REMOTE_HOST} from '../../../common/hosts';
import RestApiClient from "../../../common/api/rest-client";


const endpoint = {
    treatment: '/treatment'
};

function getTreatmentsOfPatient(patientId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.treatment + "/of/" + String(patientId), {
        method: 'GET',
        credentials: 'include',

    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getTreatmentById(treatmentId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.treatment + "/get/" + treatmentId, {
        method: 'GET',
        credentials: 'include',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertTreatment(treatmentDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.treatment, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(treatmentDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updateTreatment(treatmentDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.treatment, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(treatmentDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteTreatment(treatmentId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.treatment + "/delete/" + treatmentId, {
        method: 'DELETE',
        credentials: 'include',
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getTreatmentsOfPatient,
    getTreatmentById,
    insertTreatment,
    updateTreatment,
    deleteTreatment
};
