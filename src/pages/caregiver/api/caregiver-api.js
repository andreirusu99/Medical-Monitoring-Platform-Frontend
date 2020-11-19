import {REMOTE_HOST} from '../../../commons/hosts';
import RestApiClient from "../../../commons/api/rest-client";


const endpoint = {
    caregiver: '/caregiver'
};

function getCaregivers(callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.caregiver, {
        method: 'GET',
        credentials: 'include',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCaregiverById(caregiverId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.caregiver + "/get/" + caregiverId, {
        method: 'GET',
        credentials: 'include',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertCaregiver(caregiverDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.caregiver, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(caregiverDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updateCaregiver(caregiverDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.caregiver, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(caregiverDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteCaregiver(caregiverId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.caregiver + "/delete/" + caregiverId, {
        method: 'DELETE',
        credentials: 'include',
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getCaregivers,
    getCaregiverById,
    insertCaregiver,
    updateCaregiver,
    deleteCaregiver
};
