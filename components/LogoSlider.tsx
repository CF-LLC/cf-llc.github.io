'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './LogoSlider.module.css'

export default function LogoSlider() {
  const [tiles, setTiles] = useState<number[]>(Array.from({ length: 16 }, (_, i) => i))
  const [isSolved, setIsSolved] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)

  const shuffleTiles = useCallback(() => {
    const newTiles = [...tiles]
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
    }
    setTiles(newTiles)
    setIsSolved(false)
    setIsShuffled(true)
  }, [tiles])

  const handleTileClick = useCallback((index: number) => {
    if (!isShuffled) return
    const emptyTileIndex = tiles.indexOf(15)
    if (
      (index === emptyTileIndex - 1 && emptyTileIndex % 4 !== 0) ||
      (index === emptyTileIndex + 1 && emptyTileIndex % 4 !== 3) ||
      index === emptyTileIndex - 4 ||
      index === emptyTileIndex + 4
    ) {
      const newTiles = [...tiles]
      ;[newTiles[index], newTiles[emptyTileIndex]] = [newTiles[emptyTileIndex], newTiles[index]]
      setTiles(newTiles)
      checkSolution(newTiles)
    }
  }, [isShuffled, tiles])

  const checkSolution = useCallback((currentTiles: number[]) => {
    const solved = currentTiles.every((tile, index) => tile === index)
    setIsSolved(solved)
    if (solved) {
      setIsShuffled(false)
    }
  }, [])

  const resetPuzzle = useCallback(() => {
    setTiles(Array.from({ length: 16 }, (_, i) => i))
    setIsSolved(false)
    setIsShuffled(false)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles['grid-container']}>
        {tiles.map((tile, index) => (
          <button
            key={tile}
            onClick={() => handleTileClick(index)}
            disabled={tile === 15 || !isShuffled}
            className={`${styles['grid-button']} ${tile === 15 ? styles['empty-tile'] : ''}`}
            style={{
              backgroundImage: tile !== 15 ? `url("/logo.png")` : 'none',
              backgroundPosition: `${(tile % 4) * -54}px ${Math.floor(tile / 4) * -54}px`,
            }}
          >
            {tile !== 15 && <span className="text-transparent">Tile {tile + 1}</span>}
          </button>
        ))}
      </div>
      {!isShuffled && !isSolved && (
        <button onClick={shuffleTiles} className={styles.actionButton}>
          Shuffle
        </button>
      )}
      {isShuffled && !isSolved && (
        <button onClick={resetPuzzle} className={styles.actionButton}>
          Reset
        </button>
      )}
      {isSolved && (
        <div className={styles.celebration}>
          Congratulations! You solved the puzzle!
        </div>
      )}
    </div>
  )
}