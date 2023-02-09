import React, { ErrorInfo } from "react";
import ReactGA from "react-ga4";
import styled from "styled-components/macro";

import store, { AppState } from "../../state";
import { ExternalLink, ThemedText } from "../../theme";
import { userAgent } from "../../utils/userAgent";
import { AutoColumn } from "../Column";
import { AutoRow } from "../Row";

const FallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  z-index: 1;
`;

const BodyWrapper = styled.div<{ margin?: string }>`
  padding: 1rem;
  width: 100%;
  white-space: ;
`;

const CodeBlockWrapper = styled.div`
  background: ${({ theme }) => theme.bg0};
  overflow: auto;
  white-space: pre;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
  padding: 18px 24px;
  color: ${({ theme }) => theme.text1};
`;

const LinkWrapper = styled.div`
  color: ${({ theme }) => theme.blue1};
  padding: 6px 24px;
`;

const SomethingWentWrongWrapper = styled.div`
  padding: 6px 24px;
`;

type ErrorBoundaryState = {
  error: Error | null;
};

const IS_UNISWAP = window.location.hostname === "app.mann.xyz";

async function updateServiceWorker(): Promise<ServiceWorkerRegistration> {
  const ready = await navigator.serviceWorker.ready;
  // the return type of update is incorrectly typed as Promise<void>. See
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
  return ready.update() as unknown as Promise<ServiceWorkerRegistration>;
}

export default class ErrorBoundary extends React.Component<
  unknown,
  ErrorBoundaryState
> {
  constructor(props: unknown) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    updateServiceWorker()
      .then(async (registration) => {
        // We want to refresh only if we detect a new service worker is waiting to be activated.
        // See details about it: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
        if (registration?.waiting) {
          await registration.unregister();

          // Makes Workbox call skipWaiting(). For more info on skipWaiting see: https://developer.chrome.com/docs/workbox/handling-service-worker-updates/
          registration.waiting.postMessage({ type: "SKIP_WAITING" });

          // Once the service worker is unregistered, we can reload the page to let
          // the browser download a fresh copy of our app (invalidating the cache)
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Failed to update service worker", error);
      });
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ReactGA.event("exception", {
      description: error.toString() + errorInfo.toString(),
      fatal: true,
    });
  }

  render() {
    const { error } = this.state;

    if (error !== null) {
      const encodedBody = encodeURIComponent(issueBody(error));
      return (
        <FallbackWrapper>
          <BodyWrapper>
            <AutoColumn gap={"md"}>
              <SomethingWentWrongWrapper>
                <ThemedText.Label fontSize={24} fontWeight={600}>
                  :()
                </ThemedText.Label>
              </SomethingWentWrongWrapper>
              <CodeBlockWrapper>
                <code>
                  <ThemedText.Main fontSize={10}>{error.stack}</ThemedText.Main>
                </code>
              </CodeBlockWrapper>
            </AutoColumn>
          </BodyWrapper>
        </FallbackWrapper>
      );
    }
    return (this.props as any).children;
  }
}

function getRecontrolsntState(): null | keyof AppState {
  const path = window.location.hash;
  if (!path.startsWith("#/")) {
    return null;
  }
  const pieces = path.substring(2).split(/[/\\?]/);

  return null;
}

function issueBody(error: Error): string {
  const recontrolsntState = getRecontrolsntState();
  const deviceData = userAgent;
  return `## URL
  
${window.location.href}

${
  recontrolsntState
    ? `## \`${recontrolsntState}\` state
    
\`\`\`json
${JSON.stringify(store.getState()[recontrolsntState], null, 2)}
\`\`\`
`
    : ""
}
${
  error.name &&
  `## Error

\`\`\`
${error.name}${error.message && `: ${error.message}`}
\`\`\`
`
}
${
  error.stack &&
  `## Stacktrace

\`\`\`
${error.stack}
\`\`\`
`
}
${
  deviceData &&
  `## Device data

\`\`\`json
${JSON.stringify(deviceData, null, 2)}
\`\`\`
`
}
`;
}
