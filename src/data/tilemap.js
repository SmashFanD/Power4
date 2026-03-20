import { setDrawData } from "../game/draw.js";
import { MapSize, OutlineMedium, TileEmpty, TileEnemy, TilePlayer, TileTop, WaveContinue, WaveDraw, WaveVictory } from "./data.js";

export function TileMap() {
    const tiles = [];
    
    for (let i = 0; i < MapSize; i++) {
        for (let j = 0; j < MapSize; j++) {
            const index = i * MapSize + j;
            tiles[index] = i === 0 ? TileTop : TileEmpty;
        }
    }

    return {
        size: MapSize,
        tiles,

        getTile(x, y) {
            if (x < 0 || x >= MapSize || y < 0 || y >= MapSize) return null;
            return tiles[y * MapSize + x];
        },
        changeTile(row, newTile) {
            for (let line = MapSize; line > 0; line--) {
                const index = line * MapSize + row;
                if (this.tiles[index] !== TileEmpty) continue;
                console.log("found", this.tiles, this.tiles[index], line, row);
                if (newTile !== null) this.tiles[index] = newTile; 
                return line; //return the line to get the last play to check for victory
            }
            console.log("unfound", row, newTile, this.tiles)
        },
        canSelect(row) {
            const index = 1 * MapSize + row;
            return tiles[index] === TileEmpty;
        },
        checkVictory(lastRow, lastCol) {
            const tiles = this.tiles;
            const player = tiles[lastRow * MapSize + lastCol];

            const directions = [
                [1, 0],
                [0, 1],
                [1, 1],
                [1, -1]
            ];

            for (const [dy, dx] of directions) {
                let count = 1;

                for (let dir = -1; dir <= 1; dir += 2) {
                    let y = lastRow + dir * dy;
                    let x = lastCol + dir * dx;

                    while (
                        x >= 0 && x < MapSize &&
                        y >= 0 && y < MapSize &&
                        tiles[y * MapSize + x] === player
                    ) {
                       count++;
                       y += dir * dy;
                       x += dir * dx;
                    }
                }

                if (count >= 4) return WaveVictory;
            }

            //if no power4, then check if there is still space on the topmost row
            let selectable = 0;
            for (let i = 0; i < MapSize; i++) {
                if (this.canSelect(i)) {
                    selectable++;
                }
            }
            if (selectable === 0) return WaveDraw;
            return WaveContinue;
        },
        draw(p, player, indexAction) {
            setDrawData(p, [255, 127, 127, 255]); //Rose background
            p.rect(0, 0, 672, 672);
            
                        //draw piece to the screen, then power 4 game
            const size = 96; // 24 * 4
            const diameter = size * 0.8;
            const itemColor = player ? [255, 255, 0, 130] : [255, 0, 0, 130];
            const itemStroke = player ? [255, 255, 15, 130] : [255, 30, 30, 130];
            
            // Fond gris
            setDrawData(p, [0, 0, 255, 255], 0); //set blue
            p.rect(0, size, MapSize * size, MapSize * size); //grid propriety
            
            //Grid will be a sigle image instead, only draw the players pieces positions
            //this will get the position of each players piece instead and change color based on player and enemy
            for (let j = 1; j < MapSize; j++) {
                for (let i = 0; i < MapSize; i++) {
                    if (this.getTile(i, j) === TilePlayer) {
                        setDrawData(p, [255, 255, 0], OutlineMedium, [255, 255, 30]); //Yellow
                        p.circle(i * size + size / 2, j * size + size / 2, diameter);
                        continue;
                    }
                    if (this.getTile(i, j) === TileEnemy) {
                        setDrawData(p, [255, 0, 0], OutlineMedium, [255, 0, 30]); //Red
                        p.circle(i * size + size / 2, j * size + size / 2, diameter);
                        continue;
                    }
                }
            }

            setDrawData(p, itemColor, OutlineMedium, itemStroke); //Yellow
            
            p.circle(indexAction * size + size / 2, size / 2, diameter);
        }
    };
}