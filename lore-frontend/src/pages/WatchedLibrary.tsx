import React, { useEffect, useState } from 'react';

// Utility to get/set watched videos in localStorage
const getWatchedVideos = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('watchedVideosData') || '[]');
  } catch {
    return [];
  }
};
const removeWatchedVideo = (videoId: string) => {
  const watched = getWatchedVideos();
  const updated = watched.filter((v: any) => v.id !== videoId);
  localStorage.setItem('watchedVideosData', JSON.stringify(updated));
};

const WatchedLibrary: React.FC = () => {
  const [watched, setWatched] = useState<any[]>(getWatchedVideos());

  // Remove video from watched list
  const handleUnwatch = (videoId: string) => {
    removeWatchedVideo(videoId);
    setWatched(getWatchedVideos());
  };

  useEffect(() => {
    setWatched(getWatchedVideos());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">My Watched Videos</h2>
        {watched.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-lg mt-20">
            You haven't marked any videos as watched yet.<br />Go to the Videos page to start learning!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watched.map((video, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={video.thumbnail} alt={video.title} className="rounded-lg mb-3 w-full h-40 object-cover hover:opacity-90 transition-opacity" />
                </a>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2 line-clamp-2">{video.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Watched</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{video.channel}</p>
                  <div className="flex gap-2">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Watch on YouTube
                    </a>
                    <button
                      className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 font-semibold transition-colors"
                      onClick={() => handleUnwatch(video.id)}
                    >
                      Unwatch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedLibrary; 