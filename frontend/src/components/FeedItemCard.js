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

const FeedItemCard = ({ item, onMarkAsRead, onToggleStar, onResummarize, onRetag }) => {
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
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-md p-4 hover:shadow-lg transition mb-4">
      <div className="flex items-center flex-wrap mb-2">
        <h6 className="text-lg font-semibold truncate max-w-[75%] mr-2">
          {item.title || 'No Title Available'}
        </h6>
        {!item.read && (
          <span className="ml-2 mt-1 md:mt-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            New
          </span>
        )}
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-300 mb-2">
        {renderDescription(item.description)}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {new Date(item.publishedDate).toLocaleString()}
      </p>
      {item.summary && (
        <div className="mb-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            🧠 <strong>AI Summary</strong>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-300 mb-0">{item.summary}</p>
        </div>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            🏷️ <strong>Tags</strong>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 text-xs font-medium px-2 py-1 rounded-full lowercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-start items-center gap-2 mt-2 flex-wrap">
        <a
          href={item.feedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 p-2 flex items-center justify-center rounded border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          title="Read More"
        >
          <FontAwesomeIcon icon={faBookOpen} />
        </a>
        {!item.read && (
          <button
            className="w-9 h-9 p-2 flex items-center justify-center rounded border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition"
            title="Mark as Read"
            onClick={() => onMarkAsRead(item.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          className="w-9 h-9 p-2 flex items-center justify-center rounded border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-gray-700 transition"
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
          className="w-9 h-9 p-2 flex items-center justify-center rounded border border-gray-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Regenerate Tags"
          onClick={async () => {
            setIsRefreshing(true);
            try {
              await onRetag(item.id);
            } finally {
              setIsRefreshing(false);
            }
          }}
          disabled={isRefreshing}
        >
          <FontAwesomeIcon icon={faRotateRight} spin={isRefreshing} />
        </button>
        <button
          className="w-9 h-9 p-2 flex items-center justify-center rounded border border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700 transition"
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
