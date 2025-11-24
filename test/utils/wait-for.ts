export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1800
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const interval = setInterval(async () => {
      elapsedTime += 10;

      try {
        await assertions();
        clearInterval(interval);
        resolve();
      } catch (err) {
        if (elapsedTime >= maxDuration) {
          reject(err);
        }
      }
    }, 10);
  });
}
