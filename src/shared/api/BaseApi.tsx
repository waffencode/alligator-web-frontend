import {getAuthenticationContextData} from "../lib/authentication";

export class BaseApi {
    private BASE_PATH = "http://localhost:8080";

    protected getPath(): string {
        return this.BASE_PATH;
    }

    public async fetchJson<T>(path: string, options: RequestInit): Promise<T> {
        const response = await fetch(this.BASE_PATH + path, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && (contentType.includes('application/json') || contentType.includes('application/hal+json'))) {
            return response.json();
        } else {
            return response.text() as unknown as T;
        }
    }
}