import { Note, NotePayload, ApiConfig } from "../types/note";

const STORAGE_KEY = "think_board_notes_v1";
const CONFIG_KEY = "think_board_api_config_v1";
const LEGACY_API_BASE_URL = "http://localhost:5001";

export const DEFAULT_API_BASE_URL = "https://thinkboard.codewithmmd.ir";

const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: DEFAULT_API_BASE_URL,
  useMockFallback: false,
};

const DEFAULT_NOTES: Note[] = [
  {
    id: "1",
    title: "Welcome to Think Board",
    content:
      "This is a sample note. You can create new notes using the form above, edit existing ones, view their full details, or delete them with confirmation.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "2",
    title: "Quera",
    content: "This is Quera Think-Board minoi project",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

interface ApiEnvelope<T> {
  success?: boolean;
  response?: T;
  data?: T;
  note?: T;
  notes?: T;
  error?: string;
  message?: string;
  status?: number;
}

const normalizeBaseUrl = (baseUrl: string): string =>
  baseUrl.trim().replace(/\/+$/, "");

export const getApiConfig = (): ApiConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<ApiConfig>;
      const savedBaseUrl = normalizeBaseUrl(parsed.baseUrl || "");

      // Automatically migrate the previous localhost default to the live API.
      if (savedBaseUrl && savedBaseUrl !== LEGACY_API_BASE_URL) {
        return {
          baseUrl: savedBaseUrl,
          useMockFallback: parsed.useMockFallback ?? false,
        };
      }
    }
  } catch (error) {
    console.error("Could not read the API configuration.", error);
  }

  return DEFAULT_API_CONFIG;
};

export const saveApiConfig = (config: ApiConfig): void => {
  localStorage.setItem(
    CONFIG_KEY,
    JSON.stringify({
      ...config,
      baseUrl: normalizeBaseUrl(config.baseUrl) || DEFAULT_API_BASE_URL,
    }),
  );
};

const getLocalNotes = (): Note[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Could not read locally stored notes.", error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
  return DEFAULT_NOTES;
};

const saveLocalNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const normalizeNote = (raw: Record<string, unknown>): Note => {
  const now = new Date().toISOString();

  return {
    id: String(raw.id || raw._id || crypto.randomUUID()),
    title: typeof raw.title === "string" ? raw.title : "",
    content: typeof raw.content === "string" ? raw.content : "",
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : typeof raw.createdAt === "string"
          ? raw.createdAt
          : now,
  };
};

const isApiEnvelope = <T>(value: unknown): value is ApiEnvelope<T> =>
  typeof value === "object" && value !== null;

const buildApiUrl = (path: string, baseUrl: string): string => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl) || DEFAULT_API_BASE_URL;
  const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
  const isRunningLocally =
    typeof window !== "undefined" && localHosts.has(window.location.hostname);

  // The backend does not currently expose an Access-Control-Allow-Origin
  // header, so local development uses the Vite same-origin proxy.
  if (isRunningLocally && normalizedBaseUrl === DEFAULT_API_BASE_URL) {
    return path;
  }

  return `${normalizedBaseUrl}${path}`;
};

const getErrorMessage = (body: unknown, status: number): string => {
  if (isApiEnvelope<unknown>(body)) {
    if (typeof body.error === "string" && body.error) return body.error;
    if (typeof body.message === "string" && body.message) return body.message;
  }

  return `Request failed with status ${status}`;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const { baseUrl } = getApiConfig();
  const response = await fetch(buildApiUrl(path, baseUrl), init);
  const contentType = response.headers.get("content-type") || "";
  const body: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok || (isApiEnvelope<T>(body) && body.success === false)) {
    throw new Error(getErrorMessage(body, response.status));
  }

  if (isApiEnvelope<T>(body)) {
    if ("response" in body) return body.response as T;
    if ("data" in body) return body.data as T;
    if ("note" in body) return body.note as T;
    if ("notes" in body) return body.notes as T;
  }

  return body as T;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notesApi = {
  async getAllNotes(): Promise<{ notes: Note[]; isOfflineFallback: boolean }> {
    const config = getApiConfig();
    try {
      const rawNotes = await request<Record<string, unknown>[]>("/api/notes");
      return {
        notes: Array.isArray(rawNotes) ? rawNotes.map(normalizeNote) : [],
        isOfflineFallback: false,
      };
    } catch (error) {
      if (!config.useMockFallback) throw error;
      await delay(450);
      return {
        notes: getLocalNotes(),
        isOfflineFallback: true,
      };
    }
  },

  async getNoteById(id: string): Promise<Note> {
    const config = getApiConfig();
    try {
      const note = await request<Record<string, unknown>>(
        `/api/notes/${encodeURIComponent(id)}`,
      );
      return normalizeNote(note);
    } catch (error) {
      if (!config.useMockFallback) throw error;
      await delay(250);
      const found = getLocalNotes().find((note) => note.id === id);
      if (!found) throw new Error("Note not found");
      return found;
    }
  },

  async createNote(payload: NotePayload): Promise<Note> {
    const config = getApiConfig();
    try {
      const note = await request<Record<string, unknown>>("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return normalizeNote(note);
    } catch (error) {
      if (!config.useMockFallback) throw error;
      await delay(350);
      const now = new Date().toISOString();
      const newNote: Note = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: payload.title.trim(),
        content: payload.content.trim(),
        createdAt: now,
        updatedAt: now,
      };
      saveLocalNotes([newNote, ...getLocalNotes()]);
      return newNote;
    }
  },

  async updateNote(id: string, payload: NotePayload): Promise<Note> {
    const config = getApiConfig();
    try {
      const note = await request<Record<string, unknown>>(
        `/api/notes/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      return normalizeNote(note);
    } catch (error) {
      if (!config.useMockFallback) throw error;
      await delay(350);
      const notes = getLocalNotes();
      const index = notes.findIndex((note) => note.id === id);
      if (index === -1) throw new Error("Note not found");
      const updatedNote: Note = {
        ...notes[index],
        title: payload.title.trim(),
        content: payload.content.trim(),
        updatedAt: new Date().toISOString(),
      };
      notes[index] = updatedNote;
      saveLocalNotes(notes);
      return updatedNote;
    }
  },

  async deleteNote(id: string): Promise<void> {
    const config = getApiConfig();
    try {
      await request<unknown>(`/api/notes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (error) {
      if (!config.useMockFallback) throw error;
      await delay(300);
      saveLocalNotes(getLocalNotes().filter((note) => note.id !== id));
    }
  },
};
