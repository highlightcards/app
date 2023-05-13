import "isomorphic-fetch";
declare const fetch: any;

export class HTTPClient {
  static async get<T>(url: string, options?: any) {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Request to ${url} returned an error`);
    }

    const result: T = await response.json();
    return result;
  }

  static async post<T>(url: string, body: any, options: any = {}) {
    const headers = options?.headers || {};

    const response = await fetch(url, {
      ...options,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Request to ${url} returned an error`);
    }

    const result: T = await response.json();
    return result;
  }
}
