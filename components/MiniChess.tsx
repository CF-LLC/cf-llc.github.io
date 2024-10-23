// File: components/MiniChess.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { MiniChess, Piece } from '../lib/MiniChess'

export default function MiniChessComponent() {
  const [game, setGame] = useState(() => new MiniChess())
  const [board, setBoard] = useState<(Piece | null)[][]>([])
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const updateBoard = useCallback(() => {
    setBoard(game.getBoard())
    setStatus(game.isGameOver() ? 'Game Over' : `${game.getCurrentPlayer() === 'w' ? 'White' : 'Black'} to move`)
  }, [game])

  useEffect(() => {
    updateBoard()
  }, [updateBoard])

  const handleSquareClick = (position: string) => {
    if (selectedSquare) {
      const move = game.move(selectedSquare, position)
      if (move) {
        setSelectedSquare(null)
        updateBoard()
        setTimeout(makeRandomMove, 300)
      } else {
        setSelectedSquare(position)
      }
    } else {
      setSelectedSquare(position)
    }
  }

  const makeRandomMove = () => {
    const board = game.getBoard()
    const moves: [string, string][] = []

    for (let fromRow = 0; fromRow < 5; fromRow++) {
      for (let fromCol = 0; fromCol < 5; fromCol++) {
        const piece = board[fromRow][fromCol]
        if (piece && piece.color === game.getCurrentPlayer()) {
          for (let toRow = 0; toRow < 5; toRow++) {
            for (let toCol = 0; toCol < 5; toCol++) {
              if (fromRow !== toRow || fromCol !== toCol) {
                const from = `${String.fromCharCode(97 + fromCol)}${5 - fromRow}`
                const to = `${String.fromCharCode(97 + toCol)}${5 - toRow}`
                moves.push([from, to])
              }
            }
          }
        }
      }
    }

    if (moves.length > 0) {
      const [from, to] = moves[Math.floor(Math.random() * moves.length)]
      game.move(from, to)
      updateBoard()
    }
  }

  const getPieceSymbol = (piece: Piece | null) => {
    if (!piece) return ''
    const symbols: { [key: string]: string } = {
      p: '♟',
      n: '♞',
      b: '♝',
      r: '♜',
      q: '♛',
      k: '♚',
    }
    return piece.color === 'w' ? symbols[piece.type].toUpperCase() : symbols[piece.type]
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-1 mb-4">
        {board.flat().map((square, index) => {
          const col = index % 5
          const row = Math.floor(index / 5)
          const position = `${String.fromCharCode(97 + col)}${5 - row}`
          return (
            <button
              key={index}
              className={`w-10 h-10 flex items-center justify-center text-2xl
                ${(row + col) % 2 === 0 ? 'bg-[rgb(79,70,229)]' : 'bg-[rgb(226,231,255)]'}
                ${selectedSquare === position ? 'border-2 border-yellow-400' : ''}
              `}
              onClick={() => handleSquareClick(position)}
            >
              {getPieceSymbol(square)}
            </button>
          )
        })}
      </div>
      <div className="mb-4">{status}</div>
      <button
        className="px-4 py-2 bg-[rgb(79,70,229)] text-white rounded"
        onClick={() => {
          setGame(new MiniChess())
          setSelectedSquare(null)
          updateBoard()
        }}
      >
        New Game
      </button>
    </div>
  )
}