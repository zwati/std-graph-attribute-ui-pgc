// src/components/Rating/StarRating.jsx
// 1–5 interactive star rating input

export default function StarRating({ value = 0, onChange, readOnly = false, size = '1.5rem' }) {
  return (
    <div className="star-row" role="group">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'filled' : ''}`}
          style={{ fontSize: size, cursor: readOnly ? 'default' : 'pointer' }}
          onClick={() => !readOnly && onChange?.(star)}
          title={`${star} star${star > 1 ? 's' : ''}`}
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly ? -1 : 0}
          onKeyDown={e => e.key === 'Enter' && !readOnly && onChange?.(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
