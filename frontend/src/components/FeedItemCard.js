// src/components/FeedItemCard.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCheck,
  faStar as solidStar,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

import { sanitizeAndTransform } from '../utils/sanitizeHtml';

const FeedItemCard = ({ item, onMarkAsRead, onToggleStar, onResummarize }) => {
  const renderDescription = (description) => {
    if (typeof description === 'string') {
      return sanitizeAndTransform(description);
    } else if (description && typeof description === 'object') {
      if (description.value) {
        return sanitizeAndTransform(description.value);
      }
      return sanitizeAndTransform(JSON.stringify(description));
    }
    return '';
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="feed-item-content p-2">
      <div className="d-flex align-items-center flex-wrap mb-2">
        <h6 className="card-title mb-0 text-truncate" style={{ maxWidth: '75%' }}>
          {item.title || 'No Title Available'}
        </h6>
        {!item.read && <span className="badge bg-primary ms-2 mt-1 mt-md-0">New</span>}
      </div>
      <div className="card-text mb-2 feed-item-description">
        {renderDescription(item.description)}
      </div>
      <p className="text-muted small mb-2">{new Date(item.publishedDate).toLocaleString()}</p>
      {item.summary && (
        <div className="mb-2 p-2 border rounded bg-light">
          <div className="small text-muted mb-1">
            🧠 <strong>AI Summary</strong>
          </div>
          <p className="small mb-0">{item.summary}</p>
        </div>
      )}
      <div className="d-flex justify-content-start align-items-center gap-2 mt-2 flex-wrap">
        <a
          href={item.feedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn feed-item-action-button btn-outline-primary me-1"
          title="Read More"
        >
          <FontAwesomeIcon icon={faBookOpen} />
        </a>
        {!item.read && (
          <button
            className="btn feed-item-action-button btn-outline-success me-1"
            title="Mark as Read"
            onClick={() => onMarkAsRead(item.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          className="btn feed-item-action-button btn-outline-info"
          title="Refresh Summary"
          onClick={async () => {
            setIsRefreshing(true);
            try {
              await onResummarize(item.id);
            } finally {
              setIsRefreshing(false);
            }
          }}
          disabled={isRefreshing}
        >
          <FontAwesomeIcon icon={faRotateRight} spin={isRefreshing} />
        </button>
        <button
          className="btn feed-item-action-button btn-outline-warning"
          title={item.starred ? 'Unstar' : 'Star'}
          onClick={() => onToggleStar(item.id)}
        >
          <FontAwesomeIcon icon={item.starred ? solidStar : regularStar} />
        </button>
      </div>
    </div>
  );
};

export default FeedItemCard;
