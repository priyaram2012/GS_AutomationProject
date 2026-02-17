const { } = require('@playwright/test');

/**
 * API Client (JavaScript)
 * Ported from TypeScript APIClient
 */

class APIClient {
  constructor(apiContext, baseURL = '') {
    this.baseURL = baseURL;
    this.apiContext = apiContext;
    this.defaultHeaders = { 'Content-Type': 'application/json' };
  }

  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  async get(endpoint, options = {}) {
    const url = this.buildURL(endpoint, options.params);
    const response = await this.apiContext.get(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return this.formatResponse(response);
  }

  async post(endpoint, options = {}) {
    const url = this.buildURL(endpoint, options.params);
    const response = await this.apiContext.post(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      data: options.body || {},
    });
    return this.formatResponse(response);
  }

  async put(endpoint, options = {}) {
    const url = this.buildURL(endpoint, options.params);
    const response = await this.apiContext.put(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      data: options.body || {},
    });
    return this.formatResponse(response);
  }

  async delete(endpoint, options = {}) {
    const url = this.buildURL(endpoint, options.params);
    const response = await this.apiContext.delete(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return this.formatResponse(response);
  }

  async patch(endpoint, options = {}) {
    const url = this.buildURL(endpoint, options.params);
    const response = await this.apiContext.patch(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      data: options.body || {},
    });
    return this.formatResponse(response);
  }

  buildURL(endpoint, params) {
    // Remove trailing slash from baseURL and leading slash from endpoint to avoid double slashes
    let base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    let ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${base}${ep}`;
    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.entries(params).reduce((acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        }, {})
      ).toString();
      url += `?${qs}`;
    }
    return url;
  }

  async formatResponse(response) {
    let body = null;
    try {
      body = await response.json().catch(() => null);
    } catch (e) {
      body = await response.text().catch(() => null);
    }

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body,
      isOk: response.ok(),
    };
  }

  getBaseURL() {
    return this.baseURL;
  }

  setBaseURL(baseURL) {
    this.baseURL = baseURL;
  }
}

module.exports = APIClient;
