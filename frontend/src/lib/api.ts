const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
}

export interface BookmarkInput {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(error.detail || error.url?.[0] || error.title?.[0] || error.tags?.[0] || JSON.stringify(error));
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getBookmarks(tag?: string): Promise<Bookmark[]> {
  const url = tag ? `${API_BASE}/bookmarks/?tag=${encodeURIComponent(tag)}` : `${API_BASE}/bookmarks/`;
  const res = await fetch(url, { cache: "no-store" });
  return handleResponse(res);
}

export async function createBookmark(data: BookmarkInput): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateBookmark(id: number, data: BookmarkInput): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBookmark(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}/`, { method: "DELETE" });
  await handleResponse(res);
}
