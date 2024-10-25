'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './TicTacToe.module.css'

type Player = 'X' | 'O'
type Cell = Player | null

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null)

  const checkWinner = useCallback((squares: Cell[]): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return squares.every(Boolean) ? 'Draw' : null
  }, [])

  const handleClick = useCallback((i: number) => {
    if (board[i] || !isPlayerTurn || gameOver) return
    const newBoard = [...board]
    newBoard[i] = 'X'
    setBoard(newBoard)
    setIsPlayerTurn(false)
  }, [board, isPlayerTurn, gameOver])

  const minimax = useCallback((board: Cell[], depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(board)
    if (result !== null) {
      return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0
    }

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O'
          const score = minimax(board, depth + 1, false)
          board[i] = null
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X'
          const score = minimax(board, depth + 1, true)
          board[i] = null
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }, [checkWinner])

  const botMove = useCallback(() => {
    let bestScore = -Infinity
    let move
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O'
        const score = minimax(board, 0, false)
        board[i] = null
        if (score > bestScore) {
          bestScore = score
          move = i
        }
      }
    }
    if (move !== undefined) {
      const newBoard = [...board]
      newBoard[move] = 'O'
      setBoard(newBoard)
      setIsPlayerTurn(true)
    }
  }, [board, minimax])

  useEffect(() => {
    const winner = checkWinner(board)
    if (winner) {
      setGameOver(true)
      setWinner(winner)
    } else if (!isPlayerTurn) {
      const timer = setTimeout(botMove, 500)
      return () => clearTimeout(timer)
    }
  }, [board, isPlayerTurn, checkWinner, botMove])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameOver(false)
    setWinner(null)
  }, [])

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        {board.map((cell, i) => (
          <button
            key={i}
            className={styles.cell}
            onClick={() => handleClick(i)}
            disabled={!isPlayerTurn || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>
      {gameOver ? (
        <div className={`${styles.popup} ${winner === 'X' ? styles.win : styles.lose}`}>
          {winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}
          <button onClick={resetGame} className={styles.resetButton}>Reset</button>
        </div>
      ) : (
        <div className={styles.status}>
          {isPlayerTurn ? "Your turn" : "Bot's turn"}
        </div>
      )}
    </div>
  )
}