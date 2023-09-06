export const RootSteps = {
  FETCH_ACCOUNT: {
    id: 'fetch-account',
    name: 'Fetch Account',
  },
};

export const RootEntities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'rapid7_insight_account',
    _class: ['Account'],
    schema: {
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
      },
    },
  },
};
