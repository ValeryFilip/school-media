// Универсальный slugify для кириллицы → латиница
const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .replace(/[а-яё]/g, (ch) => map[ch] ?? ch)
        .replace(/[^a-z0-9]+/g, '-')   // всё остальное → дефисы
        .replace(/^-+|-+$/g, '');      // обрезать дефисы по краям
}
