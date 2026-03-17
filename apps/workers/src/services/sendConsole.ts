export async function sendWebhook(config: any, data: any) {
  await fetch(config.url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}
