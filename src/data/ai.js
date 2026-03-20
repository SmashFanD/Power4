import { MapSize, TileEmpty, TileEnemy, TilePlayer } from "./data.js";

export function AI() {
    return {
    
    }
}
export function evaluateMove(row, col, tiles) {
    let score = 0;
    const directions = [[1,0], [0,1], [1,1], [1,-1]];

    for (const [dy, dx] of directions) {
        let countAI = 0;
        let countOpponent = 0;
        let openEnds = 0;

        for (let dir = -1; dir <= 1; dir += 2) {
            let y = row + dir * dy;
            let x = col + dir * dx;

            while (x >= 0 && x < MapSize && y >= 0 && y < MapSize) {
                const idx = y * MapSize + x;
                if (tiles[idx] === TileEnemy) {
                    countAI++;
                } else if (tiles[idx] === TilePlayer) {
                    countOpponent++;
                    break;
                } else {
                    break;
                }
                y += dir * dy;
                x += dir * dx;
            }

            const idx = y * MapSize + x;
            if (x >= 0 && x < MapSize && y >= 0 && y < MapSize && tiles[idx] === TileEmpty) {
                openEnds++;
            }
        }

        if (countAI + 1 >= 4 && openEnds > 0) return 900000;
        if (countAI === 3 && openEnds > 0) score += 125 * openEnds;
        if (countAI === 2 && openEnds > 0) score += 25 * openEnds;
        if (countAI === 1 && openEnds > 0) score += 5 * openEnds;

        if (countOpponent === 3 && openEnds > 0) score += 250 * openEnds;
        if (countOpponent === 2 && openEnds > 0) score += 50 * openEnds;
        if (countOpponent === 1 && openEnds > 0) score += 10 * openEnds;
    }

    if (col >= 1 && col <= 5) {
        score++;
        if (col >= 2 && col <= 4) {
            score++;
            if (col === 3) score++;
        }
    }

    return score;
}