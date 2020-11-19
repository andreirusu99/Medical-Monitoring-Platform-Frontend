import {REMOTE_HOST} from "../../../commons/hosts";
import RestApiClient from "../../../commons/api/rest-client";


const endpoint = {
    login: '/login'
};

function attemptLogin(loginDTO, callback) {
    let request = new Request(REMOTE_HOST.backend_api + endpoint.login, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginDTO)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {attemptLogin}