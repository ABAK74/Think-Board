# Think Board - Frontend Bootcamp Mini Project

A clean, modular, and responsive Note Management web application built with **React**, **TypeScript**, and **Tailwind CSS**.

## Features Implemented

### Core Features
- **Notes List (`GET /api/notes`)**: Responsive grid displaying all notes.
- **Create Note (`POST /api/notes`)**: Form matching the reference UI with validation.
- **View Note Details (`GET /api/notes/:id`)**: Dedicated modal fetching and showing single note details.
- **Update Note (`PUT /api/notes/:id`)**: Modal for editing title and content of existing notes.
- **Delete Note (`DELETE /api/notes/:id`)**: Removes notes with confirmation.
- **Loading & Error Handling**: Full support for loading spinners, skeleton loaders, error banners, and retry actions.
- **Responsive Design**: Works smoothly across mobile, tablet, and desktop screens.

### Bonus Features
- **Toast Notifications**: Visual feedback for every action (create, update, delete, error).
- **Delete Confirmation Modal**: Prevents accidental deletions.
- **Real-time Search**: Filter notes by title or content.
- **Sorting**: Sort by Newest, Oldest, Recently Updated, or Alphabetical.
- **Skeleton Loading & Empty States**: Smooth UX when loading or when no notes exist.
- **Live Backend Connection**: Connects to `https://thinkboard.codewithmmd.ir` and understands its `{ success, response, status }` response envelope.
- **Optional Mock Fallback**: LocalStorage fallback can be enabled manually from API Settings for offline testing.

## Backend Connection

The app is configured to use `https://thinkboard.codewithmmd.ir`. During local development and `vite preview`, `/api` requests pass through Vite's same-origin proxy because the backend does not currently return an `Access-Control-Allow-Origin` header. The API Settings dialog can still be used to point the app at another CORS-enabled backend.

## Deploying to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the detected framework preset as **Vite**.
3. Use `npm run build` as the build command and `dist` as the output directory (Vercel normally detects both automatically).
4. Deploy the project. No environment variables are required.

The included `vercel.json` forwards `/api/*` requests to the live Think Board backend, so CRUD requests work in production without browser CORS errors.

## Project Structure

```text
src/
├── components/
│   ├── modals/
│   │   ├── ApiSettingsModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── EditNoteModal.tsx
│   │   └── ViewNoteModal.tsx
│   ├── ui/
│   │   └── ToastContainer.tsx
│   ├── EmptyState.tsx
│   ├── FilterBar.tsx
│   ├── Navbar.tsx
│   ├── NoteCard.tsx
│   ├── NoteForm.tsx
│   └── NoteSkeleton.tsx
├── services/
│   └── api.ts
├── types/
│   └── note.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Getting Started

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
