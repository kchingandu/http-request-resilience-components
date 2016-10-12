class ResiliencyStrategyConfigsFactory {
    constructor() {
        this.cheapConfig = {
            retries: 1,
            backoffInterval: 10000,
            timeoutsIntervals: [4000, 5000],
        };
        this.expensiveConfig = {
            retries: 1,
            backoffInterval: 10000,
            timeoutsIntervals: [8000, 10000],
        }
    }

    createConfig(type) {
        let config;

        switch (type) {
            case ResiliencyStrategyConfigsFactory.CHEAP: {
                config = Object.create(this.cheapConfig);
            }
                break;
            case ResiliencyStrategyConfigsFactory.EXPENSIVE: {
                config = Object.create(this.expensiveConfig);
            }
                break;

            default:
                config = Object.create({}, this.cheapConfig);
        }
        return config;
    }
}

ResiliencyStrategyConfigsFactory.CHEAP = 'cheap';

ResiliencyStrategyConfigsFactory.EXPENSIVE = 'expensive';

export default new ResiliencyStrategyConfigsFactory();