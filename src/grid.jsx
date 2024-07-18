import React, {useState} from 'react'
import styles from './grid.module.css'

export const Grid = () => {

    const [mat, setMat] = useState(Array.from({length: 30}, () => Array.from({ length: 30 }, () => 0)))

    const handleCellClick = (rowInd,cellInd) => {
        console.log('insideHandle');
        setMat((prev) => {
            const tempMat = prev.map((row,rowIndex) => {
                    return (
                        row.map((col,colIndex) => {
                            if (rowInd == rowIndex && cellInd == colIndex) {
                                return col ^ 1
                            }      
                            else {
                                return col
                            }
                        })
                    )
            })
            console.log(tempMat,'tempMat');
            return tempMat
         })
    }

    return (
        <div className={styles.gridContainer}>
            <div className={styles.gridWrapper}>
                <div className={styles.grids}>
                    {
                        mat?.map((row,rowInd) => {
                            return (
                                <div className={styles.row}> 
                                    {row?.map((cell, cellInd) => {
                                        return (
                                            <div onClick={() => handleCellClick(rowInd,cellInd)} className={`${styles.cell} ${cell !== 0 ? styles.active : styles.dead}`}>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
        </div>
    )
}
