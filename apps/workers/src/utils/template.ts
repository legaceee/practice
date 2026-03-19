export function applyTemplate(template: string, context: any) {
  return template.replace(/{{(.*?)}}/g, (_, path) => {
    const keys = path.trim().split(".");
    let value = context;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return value !== undefined ? String(value) : "";
  });
}
