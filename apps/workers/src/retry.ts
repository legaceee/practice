export async function retry(
  fn: () => Promise<any>,
  retries: number = 3,
  delay: number = 1000,
) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`retry attempt ${i + 1} failed`);

      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}
