// src/components/FeedItemList.js
import React, { useState, useEffect } from 'react';

import FeedItemCard from './FeedItemCard';
import { API_BASE } from '../config';

function FeedItemList({ feedId, onItemMarkedRead, darkMode }) {
  const [feedItems, setFeedItems] = useState([]);
  const [feedTitle, setFeedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewReadOnly, setViewReadOnly] = useState(false);
  const [viewStarredOnly, setViewStarredOnly] = useState(false);

  // Determine the API URL based on starred toggle.
  const feedItemsUrl = viewStarredOnly
    ? `${API_BASE}/feed-items/for-feed/${feedId}/starred`
    : `${API_BASE}/feed-items/for-feed/${feedId}`;

  // Fetch feed items when feedId or feedItemsUrl changes.
  useEffect(() => {
    if (!feedId) return;
    setLoading(true);
    fetch(feedItemsUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok for feed items');
        }
        return res.json();
      })
      .then((data) => {
        setFeedItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch feed items', err);
        setError(err.message);
        setLoading(false);
      });
  }, [feedId, feedItemsUrl]);

  // Fetch feed details for title (or use default if feedId is "starred")
  useEffect(() => {
    if (!feedId) return;
    if (feedId === 'starred') {
      setFeedTitle('Starred Feeds');
      return;
    }
    fetch(`${API_BASE}/feeds/${feedId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok for feed details');
        }
        return res.json();
      })
      .then((data) => setFeedTitle(data.title))
      .catch((err) => console.error('Failed to fetch feed details', err));
  }, [feedId]);

  // Mark a single item as read and trigger parent's unread count refresh.
  const markItemAsRead = (itemId) => {
    const updatedItems = feedItems.map((item) =>
      item.id === itemId ? { ...item, read: true } : item
    );
    setFeedItems(updatedItems);
    fetch(`${API_BASE}/feed-items/${itemId}/mark-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
      .then(() => {
        if (typeof onItemMarkedRead === 'function') {
          onItemMarkedRead();
        }
      })
      .catch((err) => console.error('Failed to update feed item as read', err));
  };

  // Mark all items as read.
  const markAllAsRead = () => {
    const updatedItems = feedItems.map((item) => ({ ...item, read: true }));
    setFeedItems(updatedItems);
    updatedItems.forEach((item) => {
      fetch(`${API_BASE}/feed-items/${item.id}/mark-read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      }).catch((err) => console.error('Failed to mark feed item as read:', err));
    });
    if (typeof onItemMarkedRead === 'function') {
      onItemMarkedRead();
    }
  };

  // Toggle read/unread view.
  const toggleView = () => {
    setViewReadOnly((prev) => !prev);
  };

  // Toggle starred view.
  const toggleStarredView = () => {
    setViewStarredOnly((prev) => !prev);
  };

  // Filtering: if viewing starred only, show all starred items; otherwise, apply read/unread filter.
  const displayedItems = viewStarredOnly
    ? feedItems
    : feedItems.filter((item) => (viewReadOnly ? item.read : !item.read));

  // Toggle star status.
  const toggleStar = (itemId) => {
    fetch(`${API_BASE}/feed-items/${itemId}/toggle-star`, {
      method: 'PATCH',
    })
      .then(() => {
        const updatedItems = feedItems.map((i) =>
          i.id === itemId ? { ...i, starred: !i.starred } : i
        );
        setFeedItems(updatedItems);
      })
      .catch((err) => console.error('Failed to toggle star', err));
  };

  // Open the "Read More" link.
  const openReadMore = (item) => {
    window.open(item.feedLink, '_blank', 'noopener,noreferrer');
  };

  const handleResummarize = (itemId) => {
    return fetch(`${API_BASE}/feed-items/${itemId}/resummarize`, {
      method: 'PATCH',
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.text();
      })
      .then((summary) => {
        setFeedItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, summary } : item))
        );
      });
  };

  const handleRetag = (itemId) => {
    return fetch(`${API_BASE}/feed-items/${itemId}/retag`, {
      method: 'PATCH',
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((tags) => {
        setFeedItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, tags } : item))
        );
      });
  };

  if (loading)
    return (
      <div className="flex justify-center my-5">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-300" />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 px-4 py-2 rounded">
        Error: {error}
      </div>
    );

  return (
    <div
      className={`${darkMode ? 'bg-gray-900 text-white border-l border-gray-700' : 'bg-white text-gray-900 border-l border-gray-200'} flex-1 overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
          <h2 className="truncate max-w-[300px] font-semibold text-xl">
            Feed Items for {feedTitle || 'Feed'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-800 text-sm"
              onClick={markAllAsRead}
            >
              Mark All As Read
            </button>
            <button
              className="px-3 py-1 rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 text-sm"
              onClick={toggleView}
            >
              {viewReadOnly ? 'View Unread' : 'View Read'}
            </button>
            <button
              className="px-3 py-1 rounded border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-800 text-sm"
              onClick={toggleStarredView}
            >
              {viewStarredOnly ? 'View All Items' : 'View Starred Only'}
            </button>
          </div>
        </div>
        {displayedItems.length === 0 ? (
          <div className="text-center text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 px-4 py-2 text-sm rounded">
            No feed items to display. Please check your filters or add new feeds!
          </div>
        ) : (
          <div className="space-y-4 bg-transparent">
            {displayedItems.map((item) => (
              <div key={item.id} className="bg-transparent">
                <FeedItemCard
                  item={item}
                  onMarkAsRead={markItemAsRead}
                  onToggleStar={toggleStar}
                  onReadMore={openReadMore}
                  onResummarize={handleResummarize}
                  onRetag={handleRetag}
                />
              </div>
            ))}
          </div>
        )}
      </div>{' '}
      {/* End of p-4 wrapper */}
    </div>
  );
}

export default FeedItemList;
