import "./Card.css";

function Card({ card, handleChoice, choiceOne, choiceTwo }) {
  const flipped = card === choiceOne || card === choiceTwo || card.matched;

  return (
    <div
      className={`card-wrapper ${flipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
      onClick={() => handleChoice(card)}
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className="card-back">{card.emoji}</div>
      </div>
    </div>
  );
}

export default Card;
