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

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
