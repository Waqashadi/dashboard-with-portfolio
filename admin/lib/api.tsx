import { getSession } from "next-auth/react";

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const shouldRetryApiRequest = (failureCount: number, error: unknown) => {
  if (
    error instanceof ApiError &&
    error.status !== null &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return false;
  }

  return failureCount < 2;
};

const publicApiBaseUrl = process.env.NEXT_PUBLIC_PUBLIC_API_URL;
const adminApiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;

const getErrorMessage = (data: unknown, statusText: string) => {
  if (typeof data === "string" && data.length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    const message = "message" in data ? data.message : undefined;
    const error = "error" in data ? data.error : undefined;

    if (typeof message === "string") {
      return message;
    }

    if (typeof error === "string") {
      return error;
    }
  }

  return statusText || "API request failed";
};

const readResponseBody = async (
  response: Response,
): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const isAdminPath = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath.startsWith("admin/");
};

const cleanPath = (path: string) => {
  return path.replace(/^\/+/, "");
};

const getBaseUrl = (path: string) => {
  const adminRequest = isAdminPath(path);

  const baseUrl = adminRequest
    ? adminApiBaseUrl
    : publicApiBaseUrl;

  if (!baseUrl) {
    throw new ApiError(
      adminRequest
        ? "NEXT_PUBLIC_ADMIN_API_URL is not configured"
        : "NEXT_PUBLIC_PUBLIC_API_URL is not configured",
      null,
    );
  }

  return baseUrl.replace(/\/+$/, "");
};

const request = async <T,>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> => {
  const baseUrl = getBaseUrl(path);
  const normalizedPath = cleanPath(path);

  const adminRequest = isAdminPath(path);

  /*
   * If the caller uses:
   *
   *   /admin/dashboard
   *
   * the admin base URL already contains:
   *
   *   /api/admin
   *
   * so we remove "admin/" from the actual request path.
   */
  const requestPath = adminRequest
    ? normalizedPath.replace(/^admin\//, "")
    : normalizedPath;

  const url = `${baseUrl}/${requestPath}`;

  const headers = new Headers({
    Accept: "application/json",
  });

  const options: RequestInit = {
    method,
    headers,
  };

  /*
   * Admin APIs require the backend JWT.
   *
   * NextAuth stores the backend JWT inside:
   *
   * session.backendAccessToken
   */
  if (adminRequest) {
    const session = await getSession();

    const accessToken = (
      session as { backendAccessToken?: string } | null
    )?.backendAccessToken;

    if (!accessToken) {
      throw new ApiError(
        "You are not authenticated. Please login again.",
        401,
      );
    }

    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown network error";

    throw new ApiError(
      `Network request failed: ${message}`,
      null,
    );
  }

  const data = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.statusText),
      response.status,
      data,
    );
  }

  return {
    data: data as T,
    status: response.status,
    headers: response.headers,
  };
};

const api = {
  get: <T,>(path: string) =>
    request<T>("GET", path),

  post: <T,>(
    path: string,
    body?: unknown,
  ) =>
    request<T>("POST", path, body),

  put: <T,>(
    path: string,
    body?: unknown,
  ) =>
    request<T>("PUT", path, body),

  delete: <T = unknown>(path: string) =>
    request<T>("DELETE", path),
};

export default api;