import ResiliencyStrategy from './resiliency/ResiliencyStrategy';
import resilientURLRequest from './httpRequest/resilientURLRequest';
import resiliencyStrategyConfigsFactory from './resiliency/ResiliencyStrategyConfigFactory';
import ApiTypeResiliencyStrategyConstants from './constants/ApiTypeResiliencyStrategyConstants';


resilientURLRequest('http://localhost:9000/success_on_first_attempt', {}, createResilienceStrategy()).then(success, failure);
resilientURLRequest('http://localhost:9000/success_on_second_attempt', {}, createResilienceStrategy()).then(success, failure);
resilientURLRequest('http://localhost:9000/timedout', {}, createResilienceStrategy()).then(success, failure);

function success(response) {
    console.info('√ success :: ', response.target.responseURL, ' >> ::', response.target.responseText);
    console.log();
}

function failure(response) {
    console.info('x failured :: ', response && response.target.responseURL);
    console.log();
}

function createResilienceStrategy() {
    let strategyValue = ApiTypeResiliencyStrategyConstants.PLAY;
    let config = resiliencyStrategyConfigsFactory.createConfig(strategyValue);
    return new ResiliencyStrategy(config);
}












