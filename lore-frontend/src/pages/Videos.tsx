import React, { useState } from 'react';

const grades = ['6', '7', '8', '9', '10', '11', '12'];
const subjects = ['Biology', 'Physics', 'Chemistry', 'Math'];
const chapters = [
  'Sexual Reproduction in Flowering Plants',
  'Human Reproduction',
  'Reproductive Health',
  'Principles of Inheritance and Variation',
  'Molecular Basis of Inheritance',
  'Evolution',
  'Human Health and Disease',
  'Microbes in Human Welfare',
  'Biotechnology – Principles and Processes',
  'Biotechnology and Its Applications',
  'Organisms and Populations',
  'Ecosystem',
  'Biodiversity and Conservation',
];

// Mock video database organized by grade, subject, and chapter
const videoDatabase = {
  '12': {
    'Biology': {
      'Sexual Reproduction in Flowering Plants': [
        {
          title: 'Sexual Reproduction in Flowering Plants - One Shot',
          thumbnail: 'https://img.youtube.com/vi/8Y5dBNZQsXc/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=8Y5dBNZQsXc',
          duration: '45:30',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Flower Structure and Pollination',
          thumbnail: 'https://img.youtube.com/vi/1ZC1yP5l5jY/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=1ZC1yP5l5jY',
          duration: '15:20',
          type: 'Concept',
          channel: 'Khan Academy'
        },
        {
          title: 'Double Fertilization in Plants',
          thumbnail: 'https://img.youtube.com/vi/UPBMG5EYydo/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=UPBMG5EYydo',
          duration: '12:45',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Human Reproduction': [
        {
          title: 'Human Reproduction - Complete Chapter One Shot',
          thumbnail: 'https://img.youtube.com/vi/9Q0XgD4S6Hk/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=9Q0XgD4S6Hk',
          duration: '52:15',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Male Reproductive System',
          thumbnail: 'https://img.youtube.com/vi/7VKEOBrbxhI/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=7VKEOBrbxhI',
          duration: '18:30',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Female Reproductive System',
          thumbnail: 'https://img.youtube.com/vi/2j8DWp8PqQc/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=2j8DWp8PqQc',
          duration: '20:15',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Reproductive Health': [
        {
          title: 'Reproductive Health - One Shot Revision',
          thumbnail: 'https://img.youtube.com/vi/3XG4eAglK_Y/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=3XG4eAglK_Y',
          duration: '38:45',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Contraceptive Methods',
          thumbnail: 'https://img.youtube.com/vi/4B2xOvKFFz4/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=4B2xOvKFFz4',
          duration: '14:20',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        }
      ],
      'Principles of Inheritance and Variation': [
        {
          title: 'Genetics - Complete Chapter One Shot',
          thumbnail: 'https://img.youtube.com/vi/5xfe9wmFXGE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=5xfe9wmFXGE',
          duration: '55:20',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Mendel\'s Laws of Inheritance',
          thumbnail: 'https://img.youtube.com/vi/Mehz7tCxjSE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=Mehz7tCxjSE',
          duration: '22:10',
          type: 'Concept',
          channel: 'Khan Academy'
        },
        {
          title: 'Blood Group Inheritance',
          thumbnail: 'https://img.youtube.com/vi/9O5JQclngOE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=9O5JQclngOE',
          duration: '16:45',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Molecular Basis of Inheritance': [
        {
          title: 'DNA Structure and Replication - One Shot',
          thumbnail: 'https://img.youtube.com/vi/8kK2zwjRV0M/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
          duration: '48:30',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Transcription and Translation',
          thumbnail: 'https://img.youtube.com/vi/2zAGAmTkZNY/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=2zAGAmTkZNY',
          duration: '25:15',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        }
      ],
      'Evolution': [
        {
          title: 'Evolution - Complete Chapter One Shot',
          thumbnail: 'https://img.youtube.com/vi/gh5i6JpIe9U/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=gh5i6JpIe9U',
          duration: '42:20',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Natural Selection and Adaptation',
          thumbnail: 'https://img.youtube.com/vi/7ROOLFdxIHY/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=7ROOLFdxIHY',
          duration: '19:30',
          type: 'Concept',
          channel: 'Khan Academy'
        }
      ],
      'Human Health and Disease': [
        {
          title: 'Human Health and Disease - One Shot',
          thumbnail: 'https://img.youtube.com/vi/6AALLHDvTKA/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=6AALLHDvTKA',
          duration: '45:15',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Common Diseases and Prevention',
          thumbnail: 'https://img.youtube.com/vi/8Y5dBNZQsXc/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=8Y5dBNZQsXc',
          duration: '21:40',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Microbes in Human Welfare': [
        {
          title: 'Microbes in Human Welfare - One Shot',
          thumbnail: 'https://img.youtube.com/vi/1ZC1yP5l5jY/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=1ZC1yP5l5jY',
          duration: '35:25',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Industrial Applications of Microbes',
          thumbnail: 'https://img.youtube.com/vi/UPBMG5EYydo/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=UPBMG5EYydo',
          duration: '18:15',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Biotechnology – Principles and Processes': [
        {
          title: 'Biotechnology - Complete Chapter One Shot',
          thumbnail: 'https://img.youtube.com/vi/9Q0XgD4S6Hk/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=9Q0XgD4S6Hk',
          duration: '50:30',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Recombinant DNA Technology',
          thumbnail: 'https://img.youtube.com/vi/7VKEOBrbxhI/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=7VKEOBrbxhI',
          duration: '24:20',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        }
      ],
      'Biotechnology and Its Applications': [
        {
          title: 'Biotechnology Applications - One Shot',
          thumbnail: 'https://img.youtube.com/vi/2j8DWp8PqQc/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=2j8DWp8PqQc',
          duration: '38:45',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Genetically Modified Organisms',
          thumbnail: 'https://img.youtube.com/vi/3XG4eAglK_Y/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=3XG4eAglK_Y',
          duration: '20:10',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Organisms and Populations': [
        {
          title: 'Organisms and Populations - One Shot',
          thumbnail: 'https://img.youtube.com/vi/4B2xOvKFFz4/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=4B2xOvKFFz4',
          duration: '44:20',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Population Growth Models',
          thumbnail: 'https://img.youtube.com/vi/5xfe9wmFXGE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=5xfe9wmFXGE',
          duration: '16:30',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        }
      ],
      'Ecosystem': [
        {
          title: 'Ecosystem - Complete Chapter One Shot',
          thumbnail: 'https://img.youtube.com/vi/Mehz7tCxjSE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=Mehz7tCxjSE',
          duration: '47:15',
          type: 'One Shot',
          channel: 'Aakash BYJU\'S'
        },
        {
          title: 'Food Chains and Food Webs',
          thumbnail: 'https://img.youtube.com/vi/9O5JQclngOE/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=9O5JQclngOE',
          duration: '19:45',
          type: 'Concept',
          channel: 'Biology Simplified'
        }
      ],
      'Biodiversity and Conservation': [
        {
          title: 'Biodiversity and Conservation - One Shot',
          thumbnail: 'https://img.youtube.com/vi/8kK2zwjRV0M/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
          duration: '41:30',
          type: 'One Shot',
          channel: 'NEET Adda247'
        },
        {
          title: 'Conservation Strategies',
          thumbnail: 'https://img.youtube.com/vi/2zAGAmTkZNY/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=2zAGAmTkZNY',
          duration: '17:20',
          type: 'Concept',
          channel: 'Aakash BYJU\'S'
        }
      ]
    }
  }
};

// --- HYBRID SYSTEM: Curated + API Videos ---
// Real YouTube Data API fetch function
const fetchYouTubeVideos = async (query: string, maxResults = 3, pageToken?: string) => {
  try {
    const apiKey = 'AIzaSyBvqli8z1FP2fkgxOn7xPut7blPJVrEub4';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API Error:', data.error);
      return [];
    }
    
    return data.items.map((item: any) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      duration: '~20:00', // YouTube API doesn't provide duration in search results
      type: 'YouTube',
      channel: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

// Utility to get/set watched videos in localStorage
const getWatchedVideos = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('watchedVideos') || '[]');
  } catch {
    return [];
  }
};
const addWatchedVideo = (videoId: string, videoObj: any) => {
  const watched = getWatchedVideos();
  if (!watched.includes(videoId)) {
    localStorage.setItem('watchedVideos', JSON.stringify([...watched, videoId]));
  }
  // Also store full video data for library
  let watchedData = [];
  try {
    watchedData = JSON.parse(localStorage.getItem('watchedVideosData') || '[]');
  } catch {}
  if (!watchedData.some((v: any) => v.id === videoId)) {
    localStorage.setItem('watchedVideosData', JSON.stringify([...watchedData, { ...videoObj, id: videoId }]));
  }
};

const Videos: React.FC = () => {
  const [form, setForm] = useState({ grade: '', subject: '', chapter: '' });
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [watchedVideos, setWatchedVideos] = useState<string[]>(getWatchedVideos());

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setVideos([]);
    setError(null);
    setHasMoreVideos(false);
    setCurrentPage(1);
  };

  // --- HYBRID VIDEO FETCH LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      // 1. Get curated videos for the selection
      let curated = videoDatabase[form.grade as keyof typeof videoDatabase]?.[form.subject as keyof typeof videoDatabase['12']]?.[form.chapter as keyof typeof videoDatabase['12']['Biology']] || [];
      
      // 2. If fewer than 5 curated, fetch more from YouTube API
      let apiVideos: any[] = [];
      if (curated.length < 5) {
        const query = `${form.grade}th grade ${form.subject} ${form.chapter} NCERT`;
        apiVideos = await fetchYouTubeVideos(query, 5 - curated.length);
      }
      
      // 3. Combine curated and API videos (curated first)
      const allVideos = [...curated, ...apiVideos.slice(0, 5 - curated.length)].filter(v => {
        // Use YouTube videoId if available, else fallback to url
        const id = v.url?.split('v=')[1]?.split('&')[0] || v.url;
        return !watchedVideos.includes(id);
      });
      
      if (allVideos.length === 0) {
        setError('No videos found for the selected combination. Please try different options.');
        setVideos([]);
        setHasMoreVideos(false);
      } else {
        setVideos(allVideos);
        // If we have videos, there might be more available
        setHasMoreVideos(true);
      }
    } catch (err) {
      setError('Error loading videos. Please try again.');
      setVideos([]);
      setHasMoreVideos(false);
    } finally {
      setLoading(false);
    }
  };

  // --- LOAD MORE VIDEOS FUNCTION ---
  const loadMoreVideos = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const query = `${form.grade}th grade ${form.subject} ${form.chapter} NCERT`;
      
      // Fetch additional videos from YouTube API
      const additionalVideos = await fetchYouTubeVideos(query, 3, undefined); // No pageToken for new search
      // Filter out watched
      const filtered = additionalVideos.filter(v => {
        const id = v.url?.split('v=')[1]?.split('&')[0] || v.url;
        return !watchedVideos.includes(id);
      });
      
      if (filtered.length > 0) {
        setVideos(prev => [...prev, ...filtered]);
        setCurrentPage(nextPage);
        setHasMoreVideos(filtered.length === 3); // If we got 3, there might be more
      } else {
        setHasMoreVideos(false);
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
      setHasMoreVideos(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- Mark as Watched Handler ---
  const handleWatched = (videoUrl: string, videoObj: any) => {
    const id = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl;
    addWatchedVideo(id, videoObj);
    setWatchedVideos(getWatchedVideos());
    // Remove from current list
    setVideos(prev => prev.filter(v => {
      const vid = v.url?.split('v=')[1]?.split('&')[0] || v.url;
      return vid !== id;
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 space-y-8">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">Video Suggestions</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">Select your grade, subject, and chapter to get personalized video recommendations</p>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Dropdown label="Grade" options={grades} value={form.grade} onChange={val => handleChange('grade', val)} />
          <Dropdown label="Subject" options={subjects} value={form.subject} onChange={val => handleChange('subject', val)} />
          <Dropdown label="Chapter" options={chapters} value={form.chapter} onChange={val => handleChange('chapter', val)} />
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50" 
            disabled={loading || !form.grade || !form.subject || !form.chapter}
          >
            {loading ? 'Loading Videos...' : 'Get Video Suggestions'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {videos.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recommended Videos for {form.grade}th Grade {form.subject} - {form.chapter}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {videos.length} videos found
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={video.thumbnail} alt={video.title} className="rounded-lg mb-3 w-full h-40 object-cover hover:opacity-90 transition-opacity" />
                  </a>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2 line-clamp-2">{video.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        video.type === 'One Shot' ? 'bg-purple-100 text-purple-700' :
                        video.type === 'Concept' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {video.type}
                      </span>
                      <span>{video.duration}</span>
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
                        className={`text-xs px-3 py-2 rounded-lg font-semibold transition-colors border ${watchedVideos.includes((video.url?.split('v=')[1]?.split('&')[0] || video.url)) ? 'bg-green-200 text-green-700 border-green-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-100 hover:text-green-700'}`}
                        disabled={watchedVideos.includes((video.url?.split('v=')[1]?.split('&')[0] || video.url))}
                        onClick={() => handleWatched(video.url, video)}
                      >
                        {watchedVideos.includes((video.url?.split('v=')[1]?.split('&')[0] || video.url)) ? 'Watched' : 'Mark as Watched'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreVideos && (
              <div className="text-center">
                <button
                  onClick={loadMoreVideos}
                  disabled={loadingMore}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Loading More Videos...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>📺</span>
                      Load More Videos
                    </span>
                  )}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Get additional video recommendations for this chapter
                </p>
              </div>
            )}

            {/* No More Videos Message */}
            {!hasMoreVideos && videos.length > 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  🎉 You've seen all available videos for this chapter!
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try a different chapter or subject for more content.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Dropdown = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Videos; 