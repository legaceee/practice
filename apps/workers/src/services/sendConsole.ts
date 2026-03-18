export async function sendWebhook(config: any, data: any) {
  const res = await fetch(config.url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return {
    success: "true",
    data: json,
  };
}
