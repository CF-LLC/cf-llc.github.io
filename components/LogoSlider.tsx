// components/LogoSlider.tsx
"use client"; 
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './LogoSlider.module.css';

export default function LogoSlider() {
  const [tiles, setTiles] = useState<number[]>(Array.from({ length: 16 }, (_, i) => i)); // Array from 0 to 15
  const emptyTileIndex = tiles.indexOf(15); // Assuming 15 represents the empty tile

  const handleTileClick = (index: number) => {
    const newTiles = [...tiles];

    // Swap the clicked tile with the empty tile
    [newTiles[index], newTiles[emptyTileIndex]] = [newTiles[emptyTileIndex], newTiles[index]];

    setTiles(newTiles);
  };

  return (
    <div className={styles['grid-container']}>
      {tiles.map((tile, index) => (
        <button
          key={tile}
          onClick={() => handleTileClick(index)}
          disabled={tile === 15} // Disable the empty tile button
          className={styles['grid-button']}
          style={{
            backgroundImage: tile !== 15 ? `url("/logo.png")` : 'none',
            backgroundPosition: `${(tile % 4) * -54}px ${(Math.floor(tile / 4)) * -54}px`, // Calculate the correct background position
          }}
        >
          {tile !== 15 && <span className="text-transparent">Tile {tile + 1}</span>}
        </button>
      ))}
    </div>
  );
}