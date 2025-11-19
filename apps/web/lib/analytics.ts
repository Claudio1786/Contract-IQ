import posthog, { PostHog } from 'posthog-js';

type AnalyticsClient = {
  init: () => void;
  capture: (name: string, properties?: Record<string, unknown>) => void;
};

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

let client: PostHog | undefined;
let initialized = false;

function createConsoleFallback(): Pick<PostHog, 'capture'> {
  return {
    capture: (eventName: string, eventProperties?: Record<string, unknown>) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[analytics]', eventName, eventProperties ?? {});
      }
    }
  } as Pick<PostHog, 'capture'>;
}

function getClient(): Pick<PostHog, 'capture'> {
  if (!initialized || typeof window === 'undefined') {
    return client ?? createConsoleFallback();
  }

  return client ?? createConsoleFallback();
}

export const analytics: AnalyticsClient = {
  init: () => {
    if (initialized || typeof window === 'undefined') {
      return;
    }

    if (!POSTHOG_KEY) {
      initialized = true;
      client = createConsoleFallback() as unknown as PostHog;
      return;
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: false
    });

    client = posthog;
    initialized = true;
  },
  capture: (name: string, properties?: Record<string, unknown>) => {
    if (!initialized) {
      analytics.init();
    }

    const target = getClient();
    target.capture(name, properties);
  }
};

export function __resetAnalyticsForTests() {
  initialized = false;
  client = undefined;
}