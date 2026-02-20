export function calcReadingTime(text: string) {
    const words = text
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(/\s+/).length;
  
    const tables = (text.match(/<table[\s>]/g) ?? []).length;
    const images = (text.match(/<img[\s>]/g) ?? []).length;
  
    const minutes =
      words / 200 +
      tables * 0.5 +
      images * 0.25;
  
    return Math.max(1, Math.ceil(minutes));
  }