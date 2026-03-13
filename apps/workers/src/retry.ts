export async function retry(
  fn: () => Promise<any>,
  retries: number = 3,
  baseDelay: number = 1000,
) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(); //function runs
    } catch (error) {
      //if it fails catch block runs
      lastError = error;
      const delay = baseDelay * 2 ** i;
      console.log(`retry attempt ${i + 1} failed`);
      //if i was less than retries run this
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}
