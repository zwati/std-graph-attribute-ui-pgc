// src/components/Rating/StarRating.jsx
// 1–5 interactive star rating input with dynamic Progress (Green), Loss (Red), or Default (Yellow) colors

export default function StarRating({ value = 0, previousValue = 0, onChange, readOnly = false, size = '1.5rem' }) {
  // Determine color scheme based on comparison with previous rating
  let activeColor = '#eab308'; // Default Yellow for first-time evaluation or unchanged score

  const hasPrevious = previousValue > 0;
  const isImproved  = hasPrevious && value > 0 && value > previousValue;
  const isLoss      = hasPrevious && value > 0 && value < previousValue;

  if (isImproved) {
    activeColor = '#16a34a'; // GREEN when teacher gives MORE stars
  } else if (isLoss) {
    activeColor = '#dc2626'; // RED when teacher gives LESS stars
  } else {
    activeColor = '#eab308'; // YELLOW for first-time or equal rating
  }

  return (
    <div className="star-row" role="group" style={{ display: 'inline-flex', gap: '.2rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isNewFilled  = star <= value;
        const isPrevFilled = star <= previousValue;

        let starColor = '#e5e7eb'; // default empty gray star
        let opacity = 1;

        if (isNewFilled) {
          // New rated star uses dynamic color (Green if improved, Red if loss, Yellow if equal/first-time)
          starColor = activeColor;
        } else if (isPrevFilled) {
          // Lighter ghost star showing earlier rating baseline
          starColor = isLoss ? '#fca5a5' : '#fde047'; // Lighter Red if loss, Lighter Yellow baseline otherwise
          opacity = 0.65;
        }

        return (
          <span
            key={star}
            className="star"
            style={{
              fontSize: size,
              color: starColor,
              opacity,
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: isNewFilled && isImproved ? 'drop-shadow(0 2px 4px rgba(22,163,74,0.3))' : isNewFilled && isLoss ? 'drop-shadow(0 2px 4px rgba(220,38,38,0.3))' : undefined,
            }}
            onClick={() => !readOnly && onChange?.(star)}
            title={
              hasPrevious
                ? `Previous: ${previousValue}★ → New: ${value || 0}★`
                : `${star} star${star > 1 ? 's' : ''}`
            }
            role={readOnly ? undefined : 'button'}
            tabIndex={readOnly ? -1 : 0}
            onKeyDown={e => e.key === 'Enter' && !readOnly && onChange?.(star)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
