import Confetti from "react-confetti";
import {
  useState,
  useEffect,
} from "react";

import Card from "./components/Card";
import "./index.css";

const easyCards = [
  "🍕", "🍕",
  "🐱", "🐱",
  "🎮", "🎮",
  "🦄", "🦄",
];

const mediumCards = [
  "🍕", "🍕",
  "🐱", "🐱",
  "🎮", "🎮",
  "🦄", "🦄",
  "🚀", "🚀",
  "🍔", "🍔",
];

const hardCards = [
  "🍕", "🍕",
  "🐱", "🐱",
  "🎮", "🎮",
  "🦄", "🦄",
  "🚀", "🚀",
  "🍔", "🍔",
  "⚽", "⚽",
  "🎵", "🎵",
];

function App() {
  const [gameStarted, setGameStarted] =
    useState(false);

  const [difficulty, setDifficulty] =
  useState("easy");  

  const [cards, setCards] =
  useState([]);

  const [choiceOne, setChoiceOne] =
    useState(null);

  const [choiceTwo, setChoiceTwo] =
    useState(null);

  const [moves, setMoves] =
    useState(0);

  const [won, setWon] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [disabled, setDisabled] =
  useState(false);  

  const [bestScore, setBestScore] =
  useState(
    Number(
      localStorage.getItem(
        "bestScore"
      )
    ) || null
  );

 const handleChoice = (card) => {
  if (disabled) return;

  if (card === choiceOne)
    return;

  if (!choiceOne) {
    setChoiceOne(card);
  } else if (!choiceTwo) {
    setChoiceTwo(card);
  }
};

  useEffect(() => {
    if (
      choiceOne &&
      choiceTwo
    ) {
      setDisabled(true);
      setMoves(
        (prevMoves) =>
          prevMoves + 1
      );

      if (
        choiceOne.emoji ===
        choiceTwo.emoji
      ) {
        setCards(
          (prevCards) =>
            prevCards.map(
              (card) =>
                card.emoji ===
                choiceOne.emoji
                  ? {
                      ...card,
                      matched: true,
                    }
                  : card
            )
        );
      }

      setTimeout(() => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
      }, 1000);
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
  const allMatched =
    cards.length > 0 &&
    cards.every(
      (card) =>
        card.matched
    );
    console.log(cards);
console.log(allMatched);

 if (
  allMatched &&
  moves > 0
) {
  setWon(true);

  const currentBest =
  Number(
    localStorage.getItem(
      "bestScore"
    )
  );

  if (
  !currentBest ||
  moves < currentBest
){
    localStorage.setItem(
      "bestScore",
      moves
    );

    setBestScore(moves);
  }
}
}, [cards, moves]);

  useEffect(() => {
    if (!gameStarted || won)
      return;

    const timer =
      setInterval(() => {
        setSeconds(
          (prevSeconds) =>
            prevSeconds + 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [gameStarted, won]);

  const getCardsByDifficulty = () => {
  let selectedCards =
    easyCards;

  if (
    difficulty === "medium"
  ) {
    selectedCards =
      mediumCards;
  }

  if (
    difficulty === "hard"
  ) {
    selectedCards =
      hardCards;
  }

  return selectedCards.map(
    (emoji, index) => ({
      id: index + 1,
      emoji,
      matched: false,
    })
  );
};

  const shuffleCards = () => {
  const shuffledCards =
    getCardsByDifficulty()
      .sort(
        () =>
          Math.random() - 0.5
      );

  setCards(shuffledCards);

  setChoiceOne(null);
  setChoiceTwo(null);
  setDisabled(false);

  setMoves(0);
  setWon(false);
  setSeconds(0);
};

  if (!gameStarted) {
    return (
      <div className="app">
         <div className="start-card">
        <h1>
          🎮 Memory Card Game
        </h1>

        <p>
          Match all emoji pairs
          to win!
        </p>

        <div className="difficulty">
  <button
    onClick={() =>
      setDifficulty(
        "easy"
      )
    }
  >
    Easy
  </button>

  <button
    onClick={() =>
      setDifficulty(
        "medium"
      )
    }
  >
    Medium
  </button>

  <button
    onClick={() =>
      setDifficulty(
        "hard"
      )
    }
  >
    Hard
  </button>
</div>

<p>
  Selected:
  {" "}
  {difficulty}
</p>

        <button
          onClick={() => {
            shuffleCards();
            setGameStarted(true);
          }}
        >
          Start Game
        </button>
      </div>
      </div>
    );
  }

return (
  <div className="app">

    {won && (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        recycle={false}
      />
    )}

    <div className="game-container">

      <h1>
        🎮 Memory Card Game
      </h1>

      <div className="stats">
        <h3>
          ⏱ {seconds}s
        </h3>

        <h3>
          🏆 {moves}
        </h3>

        <h3>
          🥇 Best Score:{" "}
          {bestScore || "-"}
        </h3>
      </div>

      {won && (
        <div className="win-message">
          <h2>
            🎉 You Won!
          </h2>

          <p>
            Completed in {moves} moves
          </p>

          <p>
            Time Taken: {seconds}s
          </p>
        </div>
      )}

   {won && (
  <>
   <div className="win-buttons">
  <button
    onClick={shuffleCards}
  >
    Play Same Level
  </button>

  <button
    onClick={() =>
      setGameStarted(false)
    }
  >
    Choose Level
  </button>
</div>
  </>
)}

      <div className="grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={
              handleChoice
            }
            choiceOne={
              choiceOne
            }
            choiceTwo={
              choiceTwo
            }
          />
        ))}
      </div>

    </div>
    
  </div>
);

}

export default App;