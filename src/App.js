import {useEffect, useState} from "react";
import {shuffle} from 'lodash';
import './App.css'


function App() {

    const [scale, setScale] = useState(0);
    const [field, setField] = useState([]);
    const [zero, setZero] = useState({r: 0, c: 0})
    const [won, setWon] = useState(false);

    function isSorted(f) {
        if(f.length === 0) return   false;
        const arr = f.flat();
        for (let i = 0; i < arr.length - 2; i++) {
            if ((arr[i + 1] - arr[i]) !== 1) return false;
        }
        if (arr[0] === 0) return false;
        return true;
    }


    useEffect(() => {
        if (isSorted(field)) {

            setWon(true);
        }
    }, [field])


    function onSetField() {
        const cells = Array.from(Array(scale * scale).keys())
        const field = shuffle(cells);
        const sortedField = chunkField(field);
        setField(sortedField);
        setZero(findZero(sortedField));
        setWon(false)
    }

    function findZero(arr) {
        const zero = {r: 0, c: 0};
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] === 0) {
                    zero.r = i;
                    zero.c = j;
                }
            }
        }
        return zero;
    }

    function chunkField(arr) {
        const res = [];
        for (let i = 0; i < arr.length; i += scale) {
            res.push(arr.slice(i, i + scale));
        }
        return res;
    }

    function onMove(ri, ci) {
        const cell = {r: ri, c: ci};

        if (cell.r === zero.r && Math.abs(cell.c - zero.c) === 1) swap(cell, zero);
        if (cell.c === zero.c && Math.abs(cell.r - zero.r) === 1) swap(cell, zero);
    }

    function swap(cell, zero) {
        [field[cell.r][cell.c], field[zero.r][zero.c]] = [field[zero.r][zero.c], field[cell.r][cell.c]]
        setZero(cell)
        setField([...field]);
    }

    return (
        <div>
            <div className={"input"}>
                <input type="number" min="2" max="10" value={scale} onChange={e => setScale(+e.target.value)}/>
                <button onClick={onSetField}>Set</button>
            </div>
            <hr/>
            {field.length > 0 && <div className={"field"}>
                {field.map((row, ri) => (
                    <div className={"row"} key={ri}>
                        {row.map((cell, ci) => (
                            <div className={"cell"} onClick={() => onMove(ri, ci)} key={ci}>
                                <p>
                                    {cell === 0 ? '' : cell}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>}
            {won && <h2>YOU WON</h2>}
        </div>
    );
}

export default App;
