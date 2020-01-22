import { useEffect, useState, useRef, useReducer } from "react";
const ID = () => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};
const genRandomNumbers = () => {
  const max = Math.ceil(9);
  const min = Math.floor(1);
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    id: ID(),
    number: n
  };
};

const Game = () => {
  const [optNumbers, setOptNumbes] = useState([]);
  const [over, setOver] = useState(false);
  const [ten, setTen] = useState(0)
  const [score, setScore] = useState(0)
  const [trakClick, setTrakClick] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const timeID = useRef(null)

  useEffect(() => {
     timeID.current = window.setInterval(() => {
      setOptNumbes(oldListNumbers => oldListNumbers.concat(genRandomNumbers()));
    }, 1000);
    if (optNumbers.length >= 10) {
      window.clearInterval(timeID.current) 
      setHighScore(s => score > s ? score: s)
      setOver(true)
    }
    return () => window.clearInterval(timeID.current);
  }, [optNumbers]);

  useEffect(() => {
    if (trakClick === 3 && ten !== 10) {
      setTen(0)
      setTrakClick(0)
      setOptNumbes([])
      setScore(0)
      setOver(true)
      setHighScore(s => score > s ? score: s)
    }
    if (ten === 10) {
      setScore(s => s + 1)
      setTen(0)
      setTrakClick(0)
    }
    if (ten > 10) {
      setTen(0)
      setTrakClick(0)
      setOptNumbes([])
      setScore(0)
      setOver(true)
      setHighScore(s => score > s ? score: s)
    }
  }, [ten])

  const handlerNumber = e => {
    e.persist();
    window.clearInterval(timeID.current)
    const id = e.target.dataset.key;
    const number = window.parseInt(e.target.textContent)
    setOptNumbes(oldOptNumbers => oldOptNumbers.filter(n => n.id !== id));
    console.log(number)
    setTen(t => t + number)
    setTrakClick(t => t + 1)
  };

  const handlerTryAgain = () => {
    setOptNumbes([])
    setOver(false)
    setTen(0)
    setTrakClick(0)
    setScore(0)
  }

  if (over) {
    return (
      <React.Fragment>
        <div className='result'>
          <h1>Game Over</h1>
          <h2>High Score: {highScore}</h2>
          <button onClick={() => handlerTryAgain()}>
            Try Again
          </button>
        </div>
        <style jsx>
          {`
            .result {
              width: 60%;
              margin: auto;
              text-align: center;
            }
            button {
              background-color: #21242E;
              color: white;
              font-size: 2.1em;
              padding: 10px;
            }
          `}
        </style>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div>
        <h1>Score: {score}</h1>
        {optNumbers.map(n => (
          <button
            key={n.id}
            className="btn"
            onClick={handlerNumber }
            data-key={n.id}
          >
            {n.number}
          </button>
        ))}
      </div>
      <style jsx>
        {`
          .btn {
            font-size: 2.7em;
            width: 5%;
          }
        `}
      </style>
    </React.Fragment>
  );
};
const App = () => {
  const [start, setStart] = useState(false);
  useEffect(() => {
    document.title = "Tens";
  }, []);
  return (
    <React.Fragment>
      {start ? (
        <Game />
      ) : (
        <div className="main">
          <h1>Tens</h1>
          <p>
            Numbers are going to show up on the screen. Select two or three
            numbers that equal 10 when added up. If they are over ten, GAME
            OVER! If you choose three and they are under ten, GAME OVER! If 10
            numbers are displayed without clearing any out, GAME OVER!
          </p>
          <button onClick={() => setStart(true)}>GO!</button>
        </div>
      )}
      <style jsx>
        {`
          .main {
            width: 60%;
            margin: auto;
            text-align: center;
          }
          p {
            font-size: 1.7em;
            line-height: 50px;
          }
          button {
            font-size: 3em;
          }
        `}
      </style>
    </React.Fragment>
  );
};
export default App;
