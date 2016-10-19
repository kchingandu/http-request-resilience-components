import chai from 'chai';
import sinon from 'sinon';
import * as BaseHttpRequestModuleExports from './BaseHttpRequest';
import * as URLRequestConfigModuleExports from './URLRequestConfig';
import httpRequest from './HttpRequest';

let BaseHttpRequest;
let URLRequestConfig;
let BaseHttpRequestStub;
let URLRequestConfigStub;
const assert = chai.assert;

describe.only('HttpRequest', ()=> {
    it('should return a promise object when invoked', function () {
        assert.instanceOf(httpRequest(), Promise);
    });

    describe('Instantiation', ()=> {
        const options = {};
        const URL = 'http://www.test.com';

        it('should add the url property to options object', ()=> {
            httpRequest(URL, options);

            assert.equal(options.url, URL)
        });

        it('should instantiate the URLRequestConfiguration passing an options object', ()=> {
            httpRequest(URL, options);

            assert.isTrue(URLRequestConfigStub.calledWithExactly(options))
        });

        it('should instantiate the BaseHttpRequest passing an options object, and an object containing the promise resolve and reject methods', ()=> {
            httpRequest(URL, options);

            let requestConfig = BaseHttpRequestStub.args[0][0];
            let eventHandler = BaseHttpRequestStub.args[0][1];

            assert.instanceOf(requestConfig, Object);
            assert.instanceOf(eventHandler.onError, Function);
            assert.instanceOf(eventHandler.onSuccess, Function);
        });
    });

    beforeEach(()=> {
        createBaseHttpRequestStub();
        createURLRequestConfigStub();
    });

    afterEach(()=> {
        restoreBaseHttpRequest();
        restoreURLRequestConfig();
    });

    function createBaseHttpRequestStub() {
        BaseHttpRequest = BaseHttpRequestModuleExports.default;
        BaseHttpRequestModuleExports.default = BaseHttpRequestStub = sinon.spy();
    }

    function createURLRequestConfigStub() {
        URLRequestConfig = URLRequestConfigModuleExports.default;
        URLRequestConfigModuleExports.default = URLRequestConfigStub = sinon.spy();
    }

    function restoreURLRequestConfig() {
        URLRequestConfigModuleExports.default = URLRequestConfig;
    }

    function restoreBaseHttpRequest() {
        BaseHttpRequestModuleExports.default = BaseHttpRequest;
    }
});