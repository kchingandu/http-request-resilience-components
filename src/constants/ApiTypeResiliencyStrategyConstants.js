const CHEAP = 'cheap';
const EXPENSIVE = 'expensive';

class ApiTypeResiliencyStrategyConstants {
}

ApiTypeResiliencyStrategyConstants.VOD = CHEAP;
ApiTypeResiliencyStrategyConstants.IMAGE = CHEAP;
ApiTypeResiliencyStrategyConstants.LINEAR = CHEAP;
ApiTypeResiliencyStrategyConstants.SEARCH = CHEAP;
ApiTypeResiliencyStrategyConstants.PLAY = EXPENSIVE;
ApiTypeResiliencyStrategyConstants.DOWNLOAD = EXPENSIVE;
ApiTypeResiliencyStrategyConstants.AUTHENTICATION = EXPENSIVE;

export default ApiTypeResiliencyStrategyConstants;