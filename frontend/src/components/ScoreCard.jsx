function ScoreCard({
  title,
  score
}) {

  return (

    <div className="score-card">

      <h3>{title}</h3>

      <h1>{score}</h1>

    </div>

  );

}

export default ScoreCard;