// File: lib/MiniChess.ts

export type Piece = {
    type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
    color: 'w' | 'b';
};

export class MiniChess {
    private board: (Piece | null)[][];
    private currentPlayer: 'w' | 'b';

    constructor() {
    this.board = this.createInitialBoard();
    this.currentPlayer = 'w';
    }

    private createInitialBoard(): (Piece | null)[][] {
    return [
        [
        { type: 'r', color: 'b' },
        { type: 'n', color: 'b' },
        { type: 'b', color: 'b' },
        { type: 'q', color: 'b' },
        { type: 'k', color: 'b' },
        ],
        [
        { type: 'p', color: 'b' },
        { type: 'p', color: 'b' },
        { type: 'p', color: 'b' },
        { type: 'p', color: 'b' },
        { type: 'p', color: 'b' },
        ],
        [null, null, null, null, null],
        [
        { type: 'p', color: 'w' },
        { type: 'p', color: 'w' },
        { type: 'p', color: 'w' },
        { type: 'p', color: 'w' },
        { type: 'p', color: 'w' },
        ],
        [
        { type: 'r', color: 'w' },
        { type: 'n', color: 'w' },
        { type: 'b', color: 'w' },
        { type: 'q', color: 'w' },
        { type: 'k', color: 'w' },
        ],
    ];
    }

    getBoard(): (Piece | null)[][] {
    return this.board;
    }

    getCurrentPlayer(): 'w' | 'b' {
    return this.currentPlayer;
    }

    move(from: string, to: string): boolean {
    const [fromCol, fromRow] = this.algebraicToCoords(from);
    const [toCol, toRow] = this.algebraicToCoords(to);

    const piece = this.board[fromRow][fromCol];
    if (!piece || piece.color !== this.currentPlayer) {
        return false;
    }

    // Simple move validation (no specific piece rules)
    if (fromRow === toRow && fromCol === toCol) {
        return false;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
    return true;
    }

    private algebraicToCoords(algebraic: string): [number, number] {
    const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 5 - parseInt(algebraic[1]);
    return [col, row];
    }

    isGameOver(): boolean {
    // Simplified game over check (just checking if kings are present)
    let whiteKing = false;
    let blackKing = false;

    for (const row of this.board) {
        for (const piece of row) {
        if (piece && piece.type === 'k') {
            if (piece.color === 'w') whiteKing = true;
            if (piece.color === 'b') blackKing = true;
        }
        }
    }

    return !(whiteKing && blackKing);
    }
}