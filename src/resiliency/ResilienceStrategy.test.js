import chai from 'chai';
import sinon from 'sinon';
import ResilienceStrategy from './ResiliencyStrategy';

const RETRIES = 1;
let setTimeoutMock;
let resilienceStrategy;
const assert = chai.assert;
const BACK_OFF_INTERVAL = 30000;

describe('ResilienceStrategy', ()=> {

    describe('successful response status codes', ()=> {
        it('should call resolve on an http status code between 200 and 299', ()=> {
            let response = { status: 200 };
            resilienceStrategy.validateResponse(response);

            assert.isTrue(resilienceStrategy.onResolve.calledWith(response));
        });

        it('should call resolve on a 302 http request status code', ()=> {
            let response = { status: 302 };
            resilienceStrategy.validateResponse(response);

            assert.isTrue(resilienceStrategy.onResolve.calledWith(response));
        });
        it('should call resolve on a 304 http request status code', ()=> {
            let response = { status: 304 };
            resilienceStrategy.validateResponse(response);

            assert.isTrue(resilienceStrategy.onResolve.calledWith(response));
        });

        it('should call resolve on a 1223 http request status code', ()=> {
            let response = { status: 1223 };
            resilienceStrategy.validateResponse(response);

            assert.isTrue(resilienceStrategy.onResolve.calledWith(response));
        });
    });

    describe('status codes that set resiliency backing off interval', ()=> {

        it('should, when presented with the status code that represent \'too may reequests\', delay calling retry', ()=> {
            let response = { status: 429 };
            resilienceStrategy.validateResponse(response);

            assert.isFalse(resilienceStrategy.onRetry.called);

            setTimeoutMock.tick(BACK_OFF_INTERVAL);

            assert.isTrue(resilienceStrategy.onRetry.called);
        });

        it('should, when presented with the status code that represent \'request time out\', delay calling retry', ()=> {
            let response = { status: 408 };
            resilienceStrategy.validateResponse(response);

            assert.isFalse(resilienceStrategy.onRetry.called);

            setTimeoutMock.tick(BACK_OFF_INTERVAL);

            assert.isTrue(resilienceStrategy.onRetry.called);
        });

        it('should, when presented with the status code that represent \'internal server error\', delay calling retry', ()=> {
            let response = { status: 500 };
            resilienceStrategy.validateResponse(response);

            assert.isFalse(resilienceStrategy.onRetry.called);

            setTimeoutMock.tick(BACK_OFF_INTERVAL);

            assert.isTrue(resilienceStrategy.onRetry.called);
        });

        beforeEach(()=> setTimeoutMock = sinon.useFakeTimers());
        afterEach(()=> setTimeoutMock.restore());
    });

    describe('Managing retries', ()=> {

        it('should call reject after the configured number of retries are exceeded', ()=> {
            const RETRIES = 3;
            createResilienceStrategy({ retries: RETRIES, backoffInterval: 0 });

            resilienceStrategy.validateResponse({ status: 1 });
            setTimeoutMock.tick(0);

            resilienceStrategy.validateResponse({ status: 1 });
            setTimeoutMock.tick(0);

            resilienceStrategy.validateResponse({ status: 1 });
            setTimeoutMock.tick(0);

            resilienceStrategy.validateResponse({ status: 1 });
            setTimeoutMock.tick(0);

            assert.isTrue(resilienceStrategy.onRetry.calledThrice);
            assert.isTrue(resilienceStrategy.onReject.calledOnce);
        });

        beforeEach(()=> setTimeoutMock = sinon.useFakeTimers());
        afterEach(()=> setTimeoutMock.restore());
    });

    beforeEach(()=> {
        createResilienceStrategy({
            retries: RETRIES,
            backoffInterval: BACK_OFF_INTERVAL
        });
    });

    function createResilienceStrategy(config) {
        resilienceStrategy = new ResilienceStrategy(config);
        setupStrategyEventHandlers(resilienceStrategy)
    }

    function setupStrategyEventHandlers(resilienceStrategy) {
        resilienceStrategy.onRetry = sinon.spy();
        resilienceStrategy.onReject = sinon.spy();
        resilienceStrategy.onResolve = sinon.spy();
    }
});


