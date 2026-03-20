import re, sys
from collections import Counter

file = sys.argv[1] if len(sys.argv) > 1 else "src/content/articles/stepen-okislenia.mdx"
text = open(file, encoding="utf-8").read()

# Убираем frontmatter
text = re.sub(r'^---.*?---\s*', '', text, flags=re.DOTALL)
# Убираем import/export строки
text = re.sub(r'^(import|export).*$', '', text, flags=re.MULTILINE)
# Убираем JSX/HTML теги и атрибуты
text = re.sub(r'<[^>]+>', ' ', text)
# Убираем URL
text = re.sub(r'https?://\S+', ' ', text)
# Убираем markdown/jsx синтаксис
text = re.sub(r'[#*_`\[\](){}|=\-+>"]', ' ', text)
# Убираем числа и спецсимволы
text = re.sub(r'[\d¹²³⁰⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉χ→±]', ' ', text)
text = re.sub(r'[^\w\s]', ' ', text)

# Только слова 3+ букв, только кириллица или латиница
words = [w.lower() for w in text.split() if len(w) >= 3 and re.match(r'^[а-яёa-z]+$', w.lower())]

# Стоп-слова (предлоги, союзы, частицы)
stop = {
    'для','это','как','что','или','они','она','его','который','при',
    'всех','все','если','более','чем','тем','так','нет','том','есть',
    'можно','этот','этой','этом','этих','эти','той','также','того',
    'там','тем','ней','ним','них','ему','ними','этом','один','одна',
    'два','три','раз','где','когда','который','которая','которые',
    'than','the','and','for','not','are','from','that','этому',
    'ещё','всегда','часто','обычно','всего','нужно','просто',
    'атому','атом','атома','атомов', 'имеют', 'равна','равен',
    'равно','бывает','такой','такое','таком'
}

filtered = [w for w in words if w not in stop]
total = len(filtered)
top = Counter(filtered).most_common(30)

print(f"Файл: {file}")
print(f"Всего значимых слов: {total}\n")
print(f"{'Слово':<22} {'Кол-во':>6}  {'Тошнота':>7}")
print("-" * 42)
for word, count in top:
    pct = count / total * 100
    flag = " ⚠" if pct > 3.0 else (" !" if pct > 2.0 else "")
    print(f"{word:<22} {count:>6}  {pct:>6.1f}%{flag}")
