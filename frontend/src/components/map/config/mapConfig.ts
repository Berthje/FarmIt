import { TerrainType } from '../types/map_types';

export const MAP_CONFIG = {
  width: 100,
  height: 100,
  tileSize: 16,
  minZoom: 0.85,
  maxZoom: 1.5,

  terrainTypes: {
    [TerrainType.GRASS]: {
      clearTime: 0,
      clearCost: 0
    },
    [TerrainType.TREE_STICKS]: {
      clearTime: 5,
      clearCost: 0
    },
    [TerrainType.TREE_RESIDUE]: {
      clearTime: 15,
      clearCost: 10
    },
    [TerrainType.STONE]: {
      clearTime: 35,
      clearCost: 80
    }
  }
};