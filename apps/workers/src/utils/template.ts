export function applyTemplate(template: string, data: any) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? value : "";
  });
}
