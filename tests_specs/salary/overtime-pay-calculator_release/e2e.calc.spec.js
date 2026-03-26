import { registerSalaryE2ETest } from '../shared/factories.js';
import { SALARY_CALCULATOR_CONFIGS } from '../shared/config.js';

registerSalaryE2ETest(SALARY_CALCULATOR_CONFIGS['overtime-pay-calculator']);
