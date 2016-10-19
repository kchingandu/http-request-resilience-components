import httpRequest from './httpRequest';

function resilientURLRequest(url, options = {}, resiliencyStrategy) {

    return new Promise((resolve, reject)=> {
        resiliencyStrategy.onResolve = resolve;
        resiliencyStrategy.onReject = reject;
        resiliencyStrategy.onRetry = send;
        send();
    });

    function send() {
        const httpResponseHandler = (response)=> resiliencyStrategy.validateResponse(response);

        options.timeout = resiliencyStrategy.getTimeoutInterval();

        httpRequest(url, options).then(httpResponseHandler, httpResponseHandler);

        console.log('request : ', JSON.stringify(options));
        console.log('');
    }
}

export default resilientURLRequest;