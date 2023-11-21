import { accountSteps } from './root';
import { insightAppSecSteps } from './app-sec';

import { insightVMSteps } from './insightvm';

const integrationSteps = [
  ...accountSteps,
  ...insightVMSteps,
  ...insightAppSecSteps,
];

export { integrationSteps };
