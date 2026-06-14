import Confetti from "react-confetti";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import "./index.css";

const easyCards   = ["🍕","🍕","🐱","🐱","🎮","🎮","🦄","🦄"];
const mediumCards = ["🍕","🍕","🐱","🐱","🎮","🎮","🦄","🦄","🚀","🚀","🍔","🍔"];
const hardCards   = ["🍕","🍕","🐱","🐱","🎮","🎮","🦄","🦄","🚀","🚀","🍔","🍔","⚽","⚽","🎵","🎵"];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty]   = useState("easy");
  const [cards, setCards]             = useState([]);
  const [choiceOne, setChoiceOne]     = useState(null);
  const [choiceTwo, setChoiceTwo]     = useState(null);
  const [moves, setMoves]             = useState(0);
  const [won, setWon]                 = useState(false);
  const [seconds, setSeconds]         = useState(0);
  const [disabled, setDisabled]       = useState(false);
  const [bestScore, setBestScore]     = useState(
    Number(localStorage.getItem("bestScore")) || null
  );

  const handleChoice = (card) => {
    if (disabled || card === choiceOne) return;
    if (!choiceOne) setChoiceOne(card);
    else if (!choiceTwo) setChoiceTwo(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      setMoves((m) => m + 1);
      if (choiceOne.emoji === choiceTwo.emoji) {
        setCards((prev) =>
          prev.map((c) => c.emoji === choiceOne.emoji ? { ...c, matched: true } : c)
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
    const allMatched = cards.length > 0 && cards.every((c) => c.matched);
    if (allMatched && moves > 0) {
      setWon(true);
      const currentBest = Number(localStorage.getItem("bestScore"));
      if (!currentBest || moves < currentBest) {
        localStorage.setItem("bestScore", moves);
        setBestScore(moves);
      }
    }
  }, [cards, moves]);

  useEffect(() => {
    if (!gameStarted || won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, won]);

  const getCards = () => {
    const base = difficulty === "hard" ? hardCards : difficulty === "medium" ? mediumCards : easyCards;
    return base.map((emoji, i) => ({ id: i + 1, emoji, matched: false }));
  };

  const shuffleCards = () => {
    setCards(getCards().sort(() => Math.random() - 0.5));
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setMoves(0);
    setWon(false);
    setSeconds(0);
  };

  const diffMeta = {
    easy:   { icon: "🌱", label: "Easy",   pairs: "4 pairs" },
    medium: { icon: "🔥", label: "Medium", pairs: "6 pairs" },
    hard:   { icon: "💀", label: "Hard",   pairs: "8 pairs" },
  };

  const formatTime = (s) => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;

  // ── START SCREEN ──
  if (!gameStarted) {
    return (
      <div className="app">
        <div className="start-card">
          <h1>🎮 Memory Game</h1>
          <p className="start-subtitle">Flip cards and match all pairs to win</p>

          <p className="difficulty-label">Choose difficulty</p>
          <div className="difficulty">
            {["easy","medium","hard"].map((d) => (
              <button
                key={d}
                className={`diff-btn ${d} ${difficulty === d ? "selected" : ""}`}
                onClick={() => setDifficulty(d)}
              >
                <span className="diff-icon">{diffMeta[d].icon}</span>
                <span>{diffMeta[d].label}</span>
                <span className="diff-pairs">{diffMeta[d].pairs}</span>
              </button>
            ))}
          </div>

          <button
            className="btn-start"
            onClick={() => { shuffleCards(); setGameStarted(true); }}
          >
            Start Game →
          </button>

          {bestScore && (
            <p className="best-score-hint">
              🏆 Your best: <span>{bestScore} moves</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── GAME SCREEN ──
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
        {/* Header */}
        <div className="game-header">
          <h1 className="game-title">🎮 Memory Game</h1>
          <button className="btn-quit" onClick={() => setGameStarted(false)}>
            ✕ Quit
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-pill time">
            <div className="stat-value">{formatTime(seconds)}</div>
            <div className="stat-label">Time</div>
          </div>
          <div className="stat-pill moves">
            <div className="stat-value">{moves}</div>
            <div className="stat-label">Moves</div>
          </div>
          <div className="stat-pill best">
            <div className="stat-value">{bestScore || "—"}</div>
            <div className="stat-label">Best</div>
          </div>
        </div>

        {/* Win banner */}
        {won && (
          <>
            <div className="win-banner">
              <h2>🎉 You won!</h2>
              <p>{moves} moves · {formatTime(seconds)}{bestScore === moves ? " · 🏆 New best!" : ""}</p>
            </div>
            <div className="win-buttons">
              <button className="btn-secondary" onClick={() => setGameStarted(false)}>
                Change Level
              </button>
              <button className="btn-primary" onClick={shuffleCards}>
                Play Again
              </button>
            </div>
          </>
        )}

        {/* Card grid */}
        <div className={`grid ${difficulty}`}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              choiceOne={choiceOne}
              choiceTwo={choiceTwo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
