import URLRequestConfig from './URLRequestConfig';
import BaseHttpRequest from './BaseHttpRequest';

export default function (url, options = {}) {
    return new Promise((onSuccess, onError) => {
        options.url = url;

        let endPointConfig = new URLRequestConfig(options);

        const request = new BaseHttpRequest(endPointConfig, { onSuccess, onError });

        request.send();
    });
}
