# Lore: NCERT Learning Platform Frontend

A modern, full-featured learning platform frontend for NCERT students, built with React, Vite, TypeScript, and Tailwind CSS.

## ✨ Features

- **Authentication**: Login/Signup with JWT, protected routes, and profile completion.
- **Dashboard**: Personalized stats, top chapters, performance charts, and badges.
- **Quiz System**: Setup, live quiz, and results with visual feedback.
- **Chatbot**: RAG-based academic assistant for instant Q&A.
- **Videos**: 
  - Select grade, subject, and chapter (with official NCERT Class 12 Biology chapters).
  - Hybrid video suggestions: curated + YouTube API.
  - “Mark as Watched” and “Load More” features.
- **Watched Library**: View and manage all videos you’ve marked as watched.
- **Modern UI**: Responsive, accessible, and consistent “Fresh Academic” theme.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🛠️ Configuration

- **YouTube API Key**: Set your YouTube Data API key in the `fetchYouTubeVideos` function in `src/pages/Videos.tsx`.
- **Backend API**: Update `VITE_API_URL` in your `.env` file for authentication/profile endpoints.

## 🗂️ Project Structure

- `src/pages/` — Main pages (Dashboard, Quiz, Videos, Auth, Profile, Library, etc.)
- `src/components/` — Shared UI components (Navbar, etc.)
- `src/api/` — API utilities (Axios client)
- `src/assets/` — (Currently empty, can be deleted)
- `src/index.css` — Tailwind and global styles
- `lore-backend/test.db` — SQLite database file used by the backend (auto-created if not present)

## 🧹 Codebase Cleanliness

- No unused files or assets.
- All features are modular and in use.
- Easy to extend for new grades, subjects, or features.

## 📄 License

MIT

---

**Built with ❤️ for NCERT learners.**
