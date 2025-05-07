// src/components/FeedDashboard.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import FeedForm from './FeedForm';
import { API_BASE } from '../config';

function FeedDashboard({ onSelectFeed, refreshTrigger, darkMode }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFeeds = () => {
    setLoading(true);
    fetch(`${API_BASE}/feeds`)
      .then((res) => res.json())
      .then((data) => {
        setFeeds(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch feeds', err);
        setLoading(false);
      });
  };

  useEffect(fetchFeeds, [refreshTrigger]);

  const handleEditFeed = (feed, e) => {
    e.stopPropagation();
    setCurrentFeed(feed);
    setShowFeedForm(true);
  };

  const handleCancelForm = () => setShowFeedForm(false);

  const handleDeleteFeed = (feedId, e) => {
    e.stopPropagation();
    fetch(`${API_BASE}/feeds/${feedId}`, { method: 'DELETE' })
      .then(() => fetchFeeds())
      .catch((err) => console.error('Failed to delete feed', err));
  };

  return (
    <div
      className={`${darkMode ? 'bg-gray-900 text-white border-r border-gray-700' : 'bg-white text-gray-900 border-r border-gray-200'} w-[280px] shrink-0 overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Your Feeds</h2>

        {showFeedForm && (
          <FeedForm
            feed={currentFeed}
            onSuccess={() => {
              fetchFeeds();
              setShowFeedForm(false);
            }}
            onCancel={handleCancelForm}
          />
        )}

        {loading && !showFeedForm && (
          <div className="flex justify-center my-5">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800 dark:border-blue-300" />
          </div>
        )}

        {!loading && feeds.length === 0 && !showFeedForm && (
          <div className="text-center text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 px-4 py-2 rounded">
            No feeds found. Add a new feed!
          </div>
        )}

        {!loading && feeds.length > 0 && (
          <div className="flex flex-col gap-3">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                onClick={() => onSelectFeed && onSelectFeed(feed.id)}
              >
                <div className="flex items-center gap-2">
                  {feed.imageUrl && (
                    <img
                      src={feed.imageUrl}
                      alt={feed.title}
                      className="w-10 h-10 object-cover rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {feed.unreadCount !== undefined && (
                    <span className="text-sm text-red-600 dark:text-red-400 flex-shrink-0">
                      ({feed.unreadCount} unread)
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <h6 className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                    {feed.title}
                  </h6>
                </div>

                <div className="flex justify-end mt-2 gap-2">
                  <button
                    className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    title="Edit Feed"
                    onClick={(e) => handleEditFeed(feed, e)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="p-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    title="Delete Feed"
                    onClick={(e) => handleDeleteFeed(feed.id, e)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedDashboard;
