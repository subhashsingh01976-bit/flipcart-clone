import "./StarRating.css";

const StarRating = ({ rating, compact = false }) => {
  const rounded = Math.round(rating * 2) / 2;

  const getRatingColor = (r) => {
    if (r >= 4) return "#388e3c";
    if (r >= 3) return "#ff9f00";
    return "#ff6161";
  };

  if (compact) {
    return (
      <div className="star-compact" style={{ background: getRatingColor(rating) }}>
        <span className="star-compact-num">{rating.toFixed(1)}</span>
        <span className="star-compact-icon">★</span>
      </div>
    );
  }

  return (
    <div className="star-full">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= Math.floor(rounded);
        const isHalf = !isFull && star - 0.5 === rounded;
        return (
          <span
            key={star}
            className={`star-icon ${isFull ? "filled" : isHalf ? "half" : "empty"}`}
          >
            {isFull ? "★" : isHalf ? "★" : "☆"}
          </span>
        );
      })}
      <span className="star-number">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
