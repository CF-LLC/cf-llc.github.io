'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styles from './Othello.module.css'

type Player = 'black' | 'white'
type Cell = Player | null

const BOARD_SIZE = 8 // Standard 8x8 Othello board

export default function Othello() {
  const [board, setBoard] = useState<Cell[][]>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')
  const [gameOver, setGameOver] = useState(false)
  const [botEnabled, setBotEnabled] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  function initializeBoard(): Cell[][] {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
    const mid = BOARD_SIZE / 2 - 1
    board[mid][mid] = 'white'
    board[mid][mid + 1] = 'black'
    board[mid + 1][mid] = 'black'
    board[mid + 1][mid + 1] = 'white'
    return board
  }

  const getOpponent = useCallback((player: Player): Player => player === 'black' ? 'white' : 'black', [])

  const isValidMove = useCallback((row: number, col: number, player: Player): boolean => {
    if (board[row][col] !== null) return false

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]

    return directions.some(([dx, dy]) => {
      let x = row + dx
      let y = col + dy
      if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || board[x][y] !== getOpponent(player)) {
        return false
      }
      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (board[x][y] === null) return false
        if (board[x][y] === player) return true
        x += dx
        y += dy
      }
      return false
    })
  }, [board, getOpponent])

  const flipPieces = useCallback((row: number, col: number, player: Player) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]

    const newBoard = board.map(row => [...row])
    newBoard[row][col] = player

    directions.forEach(([dx, dy]) => {
      let x = row + dx
      let y = col + dy
      const piecesToFlip: [number, number][] = []

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === getOpponent(player)) {
        piecesToFlip.push([x, y])
        x += dx
        y += dy
      }

      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === player) {
        piecesToFlip.forEach(([fx, fy]) => {
          newBoard[fx][fy] = player
        })
      }
    })

    return newBoard
  }, [board, getOpponent])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameOver || !isValidMove(row, col, currentPlayer)) return

    const newBoard = flipPieces(row, col, currentPlayer)
    setBoard(newBoard)
    setCurrentPlayer(getOpponent(currentPlayer))
    setGameStarted(true)
  }, [gameOver, isValidMove, flipPieces, currentPlayer, getOpponent])

  const checkGameOver = useCallback(() => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (isValidMove(i, j, 'black') || isValidMove(i, j, 'white')) return false
      }
    }
    return true
  }, [isValidMove])

  const botMove = useCallback(() => {
    let bestScore = -Infinity
    let bestMove: [number, number] | null = null

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (isValidMove(i, j, currentPlayer)) {
          const newBoard = flipPieces(i, j, currentPlayer)
          const score = evaluateBoard(newBoard, currentPlayer)
          if (score > bestScore) {
            bestScore = score
            bestMove = [i, j]
          }
        }
      }
    }

    if (bestMove) {
      const [row, col] = bestMove
      const newBoard = flipPieces(row, col, currentPlayer)
      setBoard(newBoard)
      setCurrentPlayer(getOpponent(currentPlayer))
    }
  }, [board, currentPlayer, isValidMove, flipPieces, getOpponent])

  const evaluateBoard = (board: Cell[][], player: Player) => {
    let score = 0
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === player) {
          // Prioritize corners and edges
          if ((i === 0 || i === BOARD_SIZE - 1) && (j === 0 || j === BOARD_SIZE - 1)) {
            score += 4
          } else if (i === 0 || i === BOARD_SIZE - 1 || j === 0 || j === BOARD_SIZE - 1) {
            score += 2
          } else {
            score += 1
          }
        }
      }
    }
    return score
  }

  useEffect(() => {
    if (checkGameOver()) {
      setGameOver(true)
    } else if (botEnabled && currentPlayer === 'white') {
      setTimeout(botMove, 500)
    }
  }, [board, checkGameOver, botEnabled, currentPlayer, botMove])

  const resetGame = useCallback(() => {
    setBoard(initializeBoard())
    setCurrentPlayer('black')
    setGameOver(false)
    setGameStarted(false)
  }, [])

  const countPieces = useCallback(() => {
    let black = 0
    let white = 0
    board.forEach(row => {
      row.forEach(cell => {
        if (cell === 'black') black++
        if (cell === 'white') white++
      })
    })
    return { black, white }
  }, [board])

  const { black, white } = countPieces()

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.cell} ${cell ? styles[cell] : ''} ${isValidMove(rowIndex, colIndex, currentPlayer) ? styles.validMove : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={gameOver || (botEnabled && currentPlayer === 'white') || !isValidMove(rowIndex, colIndex, currentPlayer)}
            >
              {cell && <div className={styles.piece} />}
            </button>
          ))
        ))}
      </div>
      <div className={styles.scoreContainer}>
        <div className={`${styles.score} ${gameStarted && currentPlayer === 'black' ? styles.currentPlayer : ''}`}>
          Black: {black}
        </div>
        <div className={`${styles.score} ${gameStarted && currentPlayer === 'white' ? styles.currentPlayer : ''}`}>
          White: {white}
        </div>
      </div>
      <div className={styles.controls}>
        {!gameStarted && (
          <button onClick={() => setBotEnabled(!botEnabled)} className={styles.button}>
            {botEnabled ? 'Disable Bot' : 'Enable Bot'}
          </button>
        )}
        {gameStarted && (
          <button onClick={resetGame} className={styles.button}>
            Reset Game
          </button>
        )}
      </div>
    </div>
  )
}