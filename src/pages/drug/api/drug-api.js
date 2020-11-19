import {REMOTE_HOST} from '../../../commons/hosts';
import RestApiClient from "../../../commons/api/rest-client";


const endpoint = {
    drug: '/drug'
};

function getDrugs(callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.drug, {
        method: 'GET',
        credentials: 'include',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDrugByName(drugName, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.drug + "/get/" + drugName, {
        method: 'GET',
        credentials: 'include',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertDrug(drugDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.drug, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(drugDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function updateDrug(drugDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.drug, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(drugDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDrug(drugId, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.drug + "/delete/" + drugId, {
        method: 'DELETE',
        credentials: 'include',
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDrugs,
    getDrugByName,
    insertDrug,
    updateDrug,
    deleteDrug
};
