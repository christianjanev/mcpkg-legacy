async function request<TResponse>(url: string, config: RequestInit = {headers: new Headers([["User-Agent", "christianjanev/mcpkg/0.0.1 (christianjanev7@gmail.com)"]])}): Promise<TResponse> {
    const response = await fetch(url, config);
    const data = response;
    return data as TResponse;
}

export const api = {
    get: <TResponse>(url: string) => 
        request<TResponse>(url),

    post: <TBody extends BodyInit, TResponse>(url: string, body: TBody) =>
        request<TResponse>(url, {method: "POST", body})
}