export const deviceTypes = {
  beeHeroOne: 'beeHeroOne',
  beeHeroGatewayOne: 'beeHeroGatewayOne',
  agsenzeScaleOne: 'agsenzeScaleOne',
  mothNetOne: 'mothNetOne',
  polly: 'polly',
};

export const deviceTypesConfig = {
  [deviceTypes.beeHeroOne]: 'IHS',
  [deviceTypes.beeHeroGatewayOne]: 'Gateway',
  [deviceTypes.agsenzeScaleOne]: 'Barscale',
};

export const deviceTypesConfigDropdown = [
  {
    id: deviceTypes.beeHeroOne,
    label: deviceTypesConfig[deviceTypes.beeHeroOne]
  },
  {
    id: deviceTypes.beeHeroGatewayOne,
    label: deviceTypesConfig[deviceTypes.beeHeroGatewayOne]
  },
  {
    id: deviceTypes.agsenzeScaleOne,
    label: deviceTypesConfig[deviceTypes.agsenzeScaleOne]
  }
];

