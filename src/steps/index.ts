import { accountSteps } from './account';
import { insightVMSteps } from './insightvm';

const integrationSteps = [...accountSteps, ...insightVMSteps];

export { integrationSteps };
