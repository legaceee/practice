export function sendConsole(config: any, data: any) {
  console.log("console action", data);
  return {
    success: true,
    logged: true,
  };
}
