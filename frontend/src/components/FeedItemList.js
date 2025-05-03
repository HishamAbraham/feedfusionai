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

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading feed items...</span>
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger text-center">Error: {error}</div>;

  return (
    <div className="feed-item-list">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h5 className="mb-0 text-truncate" style={{ maxWidth: '300px' }}>
          Feed Items for {feedTitle || 'Feed'}
        </h5>
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-success" onClick={markAllAsRead}>
            Mark All As Read
          </button>
          <button className="btn btn-sm btn-outline-primary" onClick={toggleView}>
            {viewReadOnly ? 'View Unread' : 'View Read'}
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={toggleStarredView}>
            {viewStarredOnly ? 'View All Items' : 'View Starred Only'}
          </button>
        </div>
      </div>
      {displayedItems.length === 0 ? (
        <div className="alert alert-warning text-center small">
          No feed items to display. Please check your filters or add new feeds!
        </div>
      ) : (
        <div className="feed-card-container">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className={`border-bottom ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
            >
              <FeedItemCard
                item={item}
                onMarkAsRead={markItemAsRead}
                onToggleStar={toggleStar}
                onReadMore={openReadMore}
                onResummarize={handleResummarize}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedItemList;
