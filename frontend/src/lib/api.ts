const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiSuccess<T> = { success: true; data: T };
type ApiFail = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};

async function parseJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError("CONFIG", "NEXT_PUBLIC_API_URL não configurada");
  }

  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include",
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  const body = (await parseJson(res)) as ApiSuccess<T> | ApiFail | null;

  if (body && typeof body === "object" && "success" in body) {
    if (body.success) {
      return body.data;
    }
    throw new ApiError(body.error.code, body.error.message, body.error.details);
  }

  throw new ApiError("NETWORK", res.statusText || "Falha na requisição");
}

export function getApiBaseUrl() {
  return baseUrl;
}

function readApiErrorShape(
  err: unknown,
): { message: string; code?: string; details?: unknown } | null {
  if (err instanceof ApiError) {
    return { message: err.message, code: err.code, details: err.details };
  }
  if (typeof err === "object" && err !== null && (err as { name?: string }).name === "ApiError") {
    const e = err as { message?: unknown; code?: unknown; details?: unknown };
    if (typeof e.message === "string") {
      return {
        message: e.message,
        code: typeof e.code === "string" ? e.code : undefined,
        details: e.details,
      };
    }
  }
  return null;
}

function firstZodFlattenMessage(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const d = details as {
    fieldErrors?: Record<string, string[] | undefined>;
    formErrors?: string[] | undefined;
  };
  for (const msgs of Object.values(d.fieldErrors ?? {})) {
    if (msgs?.[0]) return msgs[0];
  }
  const fe = d.formErrors;
  if (fe?.[0]) return fe[0];
  return null;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const api = readApiErrorShape(err);
  if (api) {
    if (api.code === "VALIDATION_ERROR") {
      const fieldMsg = firstZodFlattenMessage(api.details);
      if (fieldMsg) return fieldMsg;
    }
    return api.message;
  }

  if (err instanceof Error && err.message) {
    if (err.message === "Failed to fetch") {
      return "Não foi possível conectar à API. Verifique se ela está no ar, se NEXT_PUBLIC_API_URL está certo e se FRONTEND_ORIGIN no backend é a mesma origem desta página.";
    }
    return err.message;
  }

  return fallback;
}
