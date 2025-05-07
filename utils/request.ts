// 基于 fetch 实现 request

export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export async function request(
  options: RequestInit & {
    url: string;
    params?: Record<string, string | number>;
    format?: ResponseFormat;
  }
): Promise<any> {
  try {
    // 从 options 中提取 url 和 params
    const { url, params, format = "text", ...fetchOptions } = options;

    let finalUrl = url;

    // 如果有 params，将其拼接到 URL
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryString;
    }

    const response = await fetch(finalUrl, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 根据 format 动态返回响应
    // if (format in response) {
    //   return await response[format]();
    // }
    if (format === "text") {
      const text = await response.text();
      return { data: text };
    }
    if (format === "json") {
      const json = await response.json();
      return { data: json };
    }
    throw new Error(`Unsupported response format: ${options.format}`);
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
