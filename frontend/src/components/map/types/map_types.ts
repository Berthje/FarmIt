export enum TerrainType {
    GRASS = "grass",
    TREE_STICKS = "tree_sticks",
    TREE_RESIDUE = "tree_residue",
    STONE = "stone",
}

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
