export enum TerrainType {
    GRASS = "grass",
    TREE_STICKS = "tree_sticks",
    TREE_RESIDUE = "tree_residue",
    STONE = "stone",
}

export const TERRAIN_COLORS = {
    [TerrainType.GRASS]: 0x90EE90,      // Light green
    [TerrainType.TREE_STICKS]: 0xDEB887, // BurlyWood
    [TerrainType.TREE_RESIDUE]: 0x8B4513,// Saddle Brown
    [TerrainType.STONE]: 0x808080,       // Gray
    CENTER_AREA: 0xff0000,              // Red
};

export interface Tile {
    x: number;
    y: number;
    type: TerrainType;
    clearTime: number;
    clearCost: number;
}

export interface MapConfig {
    width: number;
    height: number;
    tileSize: number;
}
