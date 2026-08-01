export async function startMockWorker() {
  const { worker } = await import('./browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
