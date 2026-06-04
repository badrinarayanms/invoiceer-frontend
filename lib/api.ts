const BACKEND = process.env.NEXT_PUBLIC_BASE_URL

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  return fetch(`${BACKEND}${url}`, {
    credentials: "include", // 🔥 sends JWT cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })
}
