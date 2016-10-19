import chai from 'chai';
import sinon from 'sinon';
import { resilienceStrategyConfigFactory, configTypes } from './ResiliencyStrategyConfigFactory';

const assert = chai.assert;

describe('ResilienceStrategyConfigFactory', ()=> {

    it('should have a default values for a cheap calls', ()=> {
        var cheapConfig = resilienceStrategyConfigFactory.createConfig(configTypes.CHEAP);
        console.log(resilienceStrategyConfigFactory);

    });
});
