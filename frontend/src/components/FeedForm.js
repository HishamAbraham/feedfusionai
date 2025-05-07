// src/components/FeedForm.js
import React, { useState, useEffect } from 'react';

import { API_BASE } from '../config';

const FeedForm = ({ feed, onSuccess, onCancel }) => {
  // Only store the URL in local state; title comes from the backend
  const [url, setUrl] = useState(feed?.url || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (feed) {
      setUrl(feed.url);
    }
  }, [feed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Decide endpoint + method
    const apiUrl = `${API_BASE}/feeds${feed?.id ? `/${feed.id}` : ''}`;
    const method = feed ? 'PATCH' : 'POST';

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        // try to parse a message, or fallback to status
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
      // Success! notify parent to reload list, then close the form
      onSuccess();
      onCancel();
    } catch (err) {
      // Show the error in the form, let user correct URL
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">{feed ? 'Edit Feed' : 'Add New Feed'}</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
            onClick={onCancel}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded px-4 py-3">
              {error}
            </div>
          )}

          <form id="feed-form" onSubmit={handleSubmit}>
            {feed && (
              <div className="mb-4">
                <label htmlFor="feedTitle" className="block text-sm font-medium mb-1">
                  Title:
                </label>
                <input
                  id="feedTitle"
                  type="text"
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2"
                  value={feed.title}
                  disabled
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="feedUrl" className="block text-sm font-medium mb-1">
                URL:
              </label>
              <input
                id="feedUrl"
                type="url"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter feed URL"
                required
              />
            </div>
          </form>
        </div>
        <div className="flex justify-end items-center gap-3 px-5 py-4 border-t dark:border-gray-700">
          <button
            type="button"
            className="px-4 py-2 rounded border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="feed-form"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {feed ? 'Update Feed' : 'Add Feed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedForm;
