import {REMOTE_HOST} from '../../../common/hosts';
import RestApiClient from "../../../common/api/rest-client";


const endpoint = {
    doctor: '/doctor'
};

function getDoctors(callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.doctor, {
        method: 'GET',
        credentials: 'include',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDoctorById(doctorId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.doctor + "/get/" + doctorId, {
        method: 'GET',
        credentials: 'include',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertDoctor(doctorDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.doctor, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(doctorDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updateDoctor(doctorDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.doctor, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(doctorDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDoctor(doctorId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.doctor + "/delete/" + doctorId, {
        method: 'DELETE',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDoctors,
    getDoctorById,
    insertDoctor,
    updateDoctor,
    deleteDoctor
};
