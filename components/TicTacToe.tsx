'use client'

import { useState, useEffect } from 'react'

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  const checkWinner = (squares: Array<string | null>) => {
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
    return null
  }

  const handleClick = (i: number) => {
    if (board[i] || checkWinner(board) || !isPlayerTurn) return
    const newBoard = [...board]
    newBoard[i] = 'X'
    setBoard(newBoard)
    setIsPlayerTurn(false)
  }

  useEffect(() => {
    if (!isPlayerTurn && !checkWinner(board) && board.includes(null)) {
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
  }, [isPlayerTurn, board])

  const renderSquare = (i: number) => (
    <button
      key={i}
      className="w-12 h-12 bg-[rgb(79,70,229)] text-white text-2xl font-bold flex items-center justify-center"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  )

  const winner = checkWinner(board)
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (!board.includes(null)) {
    status = 'Draw'
  } else {
    status = `Next player: ${isPlayerTurn ? 'X' : 'O'}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {board.map((_, i) => renderSquare(i))}
      </div>
    </div>
  )
}