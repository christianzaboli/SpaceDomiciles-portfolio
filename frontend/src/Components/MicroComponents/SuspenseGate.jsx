const pendingPromise = new Promise(() => {});

export default function SuspenseGate({ isLoading, children }) {
  if (isLoading) {
    throw pendingPromise;
  }

  return children;
}
