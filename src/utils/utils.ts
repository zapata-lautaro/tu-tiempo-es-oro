export function debounce<F extends (...args: unknown[]) => unknown>(
  func: F,
  timeout = 300,
) {
  let timer: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, timeout);
  };
}
