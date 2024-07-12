import React, { useState, useRef, useEffect } from 'react'
import './tictaktoe.css'
import circle_icon from '../assests/circle.png'
import cross_icon from '../assests/cross.png'

const Tictaktoe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [player1, setPlayer1] = useState({ name: '', score: 0, symbol: 'X' });
  const [player2, setPlayer2] = useState({ name: '', score: 0, symbol: 'O' });
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [data, setData] = useState(Array(9).fill(""));
  const [moves, setMoves] = useState([]);

  const titleRef = useRef(null);
  const boxRefs = useRef(Array(9).fill(null).map(() => React.createRef()));

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const startGame = () => {
    if (player1.name && player2.name) {
      setGameStarted(true);
      setCurrentPlayer(player1);
    } else {
      alert("Please enter names for both players!");
    }
  };

  const toggle = (num) => {
    if (lock || !gameStarted || data[num] !== "") {
      return;
    }
    const newData = [...data];
    const newMoves = [...moves];
    if (count % 2 === 0) {
      boxRefs.current[num].current.innerHTML = `<img src='${cross_icon}' alt='X'>`;
      newData[num] = "X";
      newMoves.push(`${player1.name} placed X at position ${num + 1}`);
      setCurrentPlayer(player2);
    } else {
      boxRefs.current[num].current.innerHTML = `<img src='${circle_icon}' alt='O'>`;
      newData[num] = "O";
      newMoves.push(`${player2.name} placed O at position ${num + 1}`);
      setCurrentPlayer(player1);
    }
    setData(newData);
    setMoves(newMoves);
    setCount(count + 1);
    checkWin(newData);
  };

  const checkWin = (currentData) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentData[a] && currentData[a] === currentData[b] && currentData[a] === currentData[c]) {
        won(currentData[a]);
        return;
      }
    }

    if (count === 8) {
      titleRef.current.innerHTML = "It's a draw!";
      setLock(true);
    }
  };

  const won = (winner) => {
    setLock(true);
    if (winner === "X") {
      titleRef.current.innerHTML = `Congratulations ${player1.name}!`;
      setPlayer1(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      titleRef.current.innerHTML = `Congratulations ${player2.name}!`;
      setPlayer2(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  const reset = () => {
    setLock(false);
    setData(Array(9).fill(""));
    setMoves([]);
    titleRef.current.innerHTML = 'Tic Tac Toe In <span>React</span>';
    boxRefs.current.forEach(box => {
      box.current.innerHTML = "";
    });
    setCount(0);
    setCurrentPlayer(player1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!gameStarted) {
    return (
      <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h1 className="title">Tic Tac Toe</h1>
        <div className="player-inputs">
          <input 
            type="text" 
            placeholder="Player 1 Name (X)" 
            value={player1.name} 
            onChange={(e) => setPlayer1({...player1, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Player 2 Name (O)" 
            value={player2.name} 
            onChange={(e) => setPlayer2({...player2, name: e.target.value})}
          />
        </div>
        <button className="start-button" onClick={startGame}>Start Game</button>
        <button className="mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    );
  }

  return (
    <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="title" ref={titleRef}>Tic Tac Toe In <span>React</span></h1>
      <div className="game-info">
        <div className="score-board">
          <div>{player1.name} (X): {player1.score}</div>
          <div>{player2.name} (O): {player2.score}</div>
        </div>
        <div className="current-player">Next Turn: {currentPlayer?.name} ({currentPlayer?.symbol})</div>
      </div>
      <div className="game-container">
        <div className="board">
          {[0, 1, 2].map((row) => (
            <div className={`row${row + 1}`} key={row}>
              {[0, 1, 2].map((col) => (
                <div 
                  className="boxes" 
                  ref={boxRefs.current[row * 3 + col]} 
                  onClick={() => toggle(row * 3 + col)}
                  key={col}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div className="move-list">
          <h3>Move History</h3>
          <ul>
            {moves.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="buttons">
        <button className="reset" onClick={reset}>New Game</button>
        <button className="mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}

export default Tictaktoe;
