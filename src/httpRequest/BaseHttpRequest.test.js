import sinon from 'sinon';
import expect from 'expect';
import BaseHttpRequest from './BaseHttpRequest';

let baseHttpRequest;
let eventHandlersStub;
let requestConfigStub;
let xmlHttpRequestStub;

describe('BaseHttpRequest', ()=> {

    describe('Instantiation', ()=> {

        it('should, on instantiation, configure the xmlHttpRequest with properties from the URLRequestConfig', ()=> {
            expect(baseHttpRequest.xmlHttpRequest.timeout).toBe(requestConfigStub.getTimeoutInterval());
            expect(baseHttpRequest.xmlHttpRequest.withCredentials).toBe(requestConfigStub.getWithCredentials());
        });

        it('should, on instantiation, configure the xmlHttpRequest with the eventHandlers methods', ()=> {
            expect(baseHttpRequest.xmlHttpRequest.onerror).toEqual(eventHandlersStub.onError);
            expect(baseHttpRequest.xmlHttpRequest.onload).toEqual(eventHandlersStub.onSuccess);
            expect(baseHttpRequest.xmlHttpRequest.ontimeout).toEqual(eventHandlersStub.onError);
        });
    });

    describe('Sending a send', ()=> {

        it('should call the open function with the correct method and url derived from the URLRequestConfig', ()=> {
            const url = requestConfigStub.getUrl();
            const method = requestConfigStub.getMethod();

            baseHttpRequest.send();

            expect(baseHttpRequest.xmlHttpRequest.open.calledWithExactly(method, url)).toBe(true);
        });


        it('should call the setHeaders function if the headers are available', ()=> {
            const setRequestHeaderSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;

            requestConfigStub.getHeaders.returns({ key1: 'value1', key2: 'value2' });

            baseHttpRequest.send();

            expect(setRequestHeaderSpy.getCall(0).calledWithExactly('key1', 'value1')).toBe(true);
            expect(setRequestHeaderSpy.getCall(1).calledWithExactly('key2', 'value2')).toBe(true);
        });

        it('should not call the setHeaders function when no headers are available', ()=> {
            const setRequestHeaderSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;

            requestConfigStub.getHeaders.returns(undefined);

            baseHttpRequest.send();

            expect(setRequestHeaderSpy.called).toBe(false);
        });

        it('should call the xmlHttpRequest send function with post body value', ()=> {
            const sendSpy = baseHttpRequest.xmlHttpRequest.send;

            requestConfigStub.getPostBody.returns('key=value&key=value');

            baseHttpRequest.send();

            expect(sendSpy.calledWithExactly('key=value&key=value')).toBe(true);
        });

        it('should also call open and set headers in that order when making a send', ()=> {
            const openSpy = baseHttpRequest.xmlHttpRequest.open;
            const setHeadersSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;
            const sendSpy = baseHttpRequest.xmlHttpRequest.send;

            requestConfigStub.getHeaders.returns({ key1: 'value1', key2: 'value2' });

            baseHttpRequest.send();

            expect(sendSpy.calledAfter(setHeadersSpy)).toBe(true);
            expect(setHeadersSpy.calledAfter(openSpy)).toBe(true);
        });
    });

    beforeEach(()=> {
        createEventHandlerStub();
        createRequestConfigStub();
        createXmlHttpRequestStub();
        createBaseHttpRequest();
    });

    function createBaseHttpRequest() {
        baseHttpRequest = new BaseHttpRequest(requestConfigStub, eventHandlersStub, xmlHttpRequestStub);
    }

    function createXmlHttpRequestStub() {
        xmlHttpRequestStub = sinon.stub({
            send: Function.prototype,
            open: Function.prototype,
            setRequestHeader: Function.prototype
        });
    }

    function createEventHandlerStub() {
        eventHandlersStub = sinon.stub({
            onError: Function.prototype,
            onSuccess: Function.prototype
        });
    }

    function createRequestConfigStub() {
        requestConfigStub = sinon.stub({
            getUrl: Function.prototype,
            getMethod: Function.prototype,
            getHeaders: Function.prototype,
            getPostBody: Function.prototype,
            getTimeoutInterval: Function.prototype,
            getWithCredentials: Function.prototype
        });

        requestConfigStub.getMethod.returns('GET');
        requestConfigStub.getTimeoutInterval.returns(3000);
        requestConfigStub.getWithCredentials.returns(false);
        requestConfigStub.getUrl.returns('http://test.com');
    }
});