'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './TicTacToe.module.css'

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const checkWinner = useCallback((squares: Array<string | null>) => {
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
        return lines[i]
      }
    }
    return null
  }, [])

  const handleClick = useCallback((i: number) => {
    if (board[i] || gameOver || !isPlayerTurn) return
    const newBoard = [...board]
    newBoard[i] = 'X'
    setBoard(newBoard)
    setIsPlayerTurn(false)
  }, [board, gameOver, isPlayerTurn])

  useEffect(() => {
    const winner = checkWinner(board)
    if (winner) {
      setWinningLine(winner)
      setGameOver(true)
    } else if (!board.includes(null)) {
      setGameOver(true)
    } else if (!isPlayerTurn) {
      const timer = setTimeout(() => {
        let index
        do {
          index = Math.floor(Math.random() * 9)
        } while (board[index])
        const newBoard = [...board]
        newBoard[index] = 'O'
        setBoard(newBoard)
        setIsPlayerTurn(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [board, isPlayerTurn, checkWinner])

  const renderSquare = (i: number) => (
    <button
      key={i}
      className={`${styles.square} ${winningLine?.includes(i) ? styles.winningSquare : ''}`}
      onClick={() => handleClick(i)}
      disabled={gameOver || !isPlayerTurn}
    >
      {board[i]}
    </button>
  )

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setWinningLine(null)
    setGameOver(false)
  }, [])

  let status
  if (winningLine) {
    status = `Winner: ${board[winningLine[0]]}`
  } else if (gameOver) {
    status = 'Draw'
  } else {
    status = `Next player: ${isPlayerTurn ? 'X' : 'O'}`
  }

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        {board.map((_, i) => renderSquare(i))}
      </div>
      <div className={styles.status}>{status}</div>
      {gameOver && (
        <button onClick={resetGame} className={styles.resetButton}>
          Reset Game
        </button>
      )}
    </div>
  )
}