// src/lib/categoryColors.ts
/**
 * Единая палитра категорий (чистые цвета, без оттенков).
 * Меняешь хэш — перекрашиваются бейджи/чипы/ховеры везде.
 */
export const CATEGORY_HEX: Record<string, string> = {
    "новости": "#1D4EFF",
    "материалы по химии": "#8E7CF3",
    "материалы для егэ и огэ по химии": "#8E7CF3",
    "школьникам": "#F4A62A",
    "родителям": "#2AA5A1",
    "поступление": "#1D4EFF",
    "психология": "#7BC65B",
    "как быть взрослым": "#C05B66",
};

const DEFAULT_HEX = "#0D6EFD";

/** Получить цвет категории по имени (регистр/язык не важны) */
export function getCategoryHex(name: string | undefined | null): string {
    if (!name) return DEFAULT_HEX;
    const key = String(name).trim().toLowerCase();
    return CATEGORY_HEX[key] ?? DEFAULT_HEX;
}

/** Контрастный цвет текста на фоне `hex` (#RRGGBB) */
export function getContrastOn(hex: string): string {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return "#ffffff";
    const r = parseInt(m[1], 16) / 255;
    const g = parseInt(m[2], 16) / 255;
    const b = parseInt(m[3], 16) / 255;
    // относительная яркость (sRGB gamma 2.2)
    const lum =
        0.2126 * Math.pow(r, 2.2) +
        0.7152 * Math.pow(g, 2.2) +
        0.0722 * Math.pow(b, 2.2);
    return lum > 0.57 ? "#111111" : "#ffffff";
}
