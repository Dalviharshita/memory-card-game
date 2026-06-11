import "./Card.css";
function Card({
  card,
  handleChoice,
  choiceOne,
  choiceTwo,
}) {
  const flipped =
    card === choiceOne ||
    card === choiceTwo ||
    card.matched;

  return (
   <div
  className={`card ${
    flipped
      ? "flipped"
      : ""
  }`}
  onClick={() =>
    handleChoice(card)
  }
>
  {flipped
    ? card.emoji
    : "❓"}
</div>
  );
}

export default Card;