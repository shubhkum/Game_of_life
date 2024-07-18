import React, {useState,useRef,useEffect} from 'react'
import styles from './grid.module.css'
import { myName } from './Constants'


export const Grid = () => {
    const [mat, setMat] = useState(Array.from({length: 30}, () => Array.from({ length: 30 }, () => 0)))
    const [isStarted, setIsStarted] = useState(false)
    const intervalRef = useRef(null)
    const [empty,setEmpty] = useState(true)

    useEffect(() => {
        let empty = true
        for (let i =0 ;i < mat.length; i++){
            for (let j=0 ; j<mat[0].length;j++){
                if (mat[i][j] ==1) {
                    empty = false
                    break
                } 
            }
            if (!empty) {
                break
            }
        }
        if (empty) {
            setIsStarted(false)
        }
        setEmpty(empty)
    },[mat])

    useEffect(() => {
        if (isStarted) {
            intervalRef.current = setInterval(() => {
                getNewMat();
            }, 600);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isStarted]);

    const myNameMat = () => {
        setMat(myName)
        setIsStarted(false)
    }
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
    const handleSimulation = () => {
        if (!empty) {
            setIsStarted((prev) => !prev)
        }
    }
    const getActiveNeighbours = (currMat,rowIndex,colIndex) => {
        let ans = 0
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
    
        directions.forEach(([dx, dy]) => {
            const newRow = rowIndex + dx;
            const newCol = colIndex + dy;
            if (newRow >= 0 && newRow < currMat.length && newCol >= 0 && newCol < currMat[0].length) {
                ans += currMat[newRow][newCol];
            }
        });
        return ans
    }
    const getNewMat = () => {
        setMat((prev) => {
            const tempMat = prev.map((row,rowIndex) => {
                return (
                    row.map((col, colIndex) => {
                        const noOfActiveNeighbours = getActiveNeighbours(prev,rowIndex,colIndex) 
                        if (col == 0 && noOfActiveNeighbours == 3) {
                            return 1
                        } else if (col == 1 && (noOfActiveNeighbours ==2 || noOfActiveNeighbours==3)){
                            return 1
                        } else if (col == 1 && noOfActiveNeighbours <2){
                            return 0
                        } else if (col == 1 && noOfActiveNeighbours >=4){
                            return 0
                        } else {
                            return col
                        }
                    })
                )
            })
            return tempMat
        })
    }
   
    return (
        <div className={styles.gridContainer}>
            <div className={styles.gridWrapper}>
                <div className={styles.instructions}>
                    <h2 style={{textDecoration:'underline', textAlign:'center'}}>Instructions</h2>
                    <div className={styles.texts}>
                        <p>1. Draw an initial pattern on the grid at the center</p>
                        <p>2. Click Start to allow multiplication of cells according to Conway's law</p>
                        <p>3. Click Stop at any point in time to stop the multiplication</p>
                        <p>4. Click Reset to set an initial pattern</p>
                    </div>
                </div>
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
                    <div className={styles.buttons}>
                        <div className={`${styles.button} ${empty ? styles.disabled : ''}`} onClick={() => handleSimulation()}>
                            {isStarted ? 'STOP' : 'START'}
                        </div>
                        <div className={styles.button}  onClick={() => myNameMat()}>
                            RESET
                        </div>
                    </div>                    
                </div>
                <div className={styles.rules}>
                    <h2 style={{textDecoration:'underline', textAlign:'center'}}>Rules of cell multiplication</h2>
                    <div className={styles.texts}>
                        <p>1. A dead cell will come alive if exactly 3 neighbours are living</p>
                        <p>2. A living cell will stay alive if 2 or 3 neighbours are living</p>
                        <p>3. Cells with less than 2 living neighbours will die of underpopulation</p>
                        <p>4. Cells with more than 4 living neighbours will die of overpopulation</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
