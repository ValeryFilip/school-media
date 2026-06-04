/**
 * Общие данные отзывов: картинки для блока отзывов и поля для Product schema (JSON-LD).
 * Используется в ReviewsSection и в buildProductJsonLd на страницах курсов.
 */

export interface ReviewImage {
  src: string;
  alt: string;
}

/** Отзыв с полями для schema.org Review (Product.review) */
export interface ReviewForSchema {
  author: string;
  datePublished: string;
  reviewBody: string;
  ratingValue?: number;
  image?: string;
}

/** Все картинки отзывов для бегущей строки (одинаковые на всех страницах курсов) */
export const REVIEW_IMAGES: ReviewImage[] = [
  { src: "/images/stepik/reviews/student-review-01.webp", alt: "Отзыв 1" },
  { src: "/images/stepik/reviews/student-review-02.webp", alt: "Отзыв 2" },
  { src: "/images/stepik/reviews/student-review-03.webp", alt: "Отзыв 3" },
  { src: "/images/stepik/reviews/student-review-04.webp", alt: "Отзыв 4" },
  { src: "/images/stepik/reviews/student-review-05.webp", alt: "Отзыв 5" },
  { src: "/images/stepik/reviews/student-review-06.webp", alt: "Отзыв 6" },
  { src: "/images/stepik/reviews/student-review-07.webp", alt: "Отзыв 7" },
  { src: "/images/stepik/reviews/student-review-08.webp", alt: "Отзыв 8" },
  { src: "/images/stepik/reviews/student-review-09.webp", alt: "Отзыв 9" },
  { src: "/images/stepik/reviews/student-review-10.webp", alt: "Отзыв 10" },
  { src: "/images/stepik/reviews/student-review-11.webp", alt: "Отзыв 11" },
  { src: "/images/stepik/reviews/student-review-12.webp", alt: "Отзыв 12" },
  { src: "/images/stepik/reviews/student-review-13.webp", alt: "Отзыв 13" },
  { src: "/images/stepik/reviews/student-review-14.webp", alt: "Отзыв 14" },
  { src: "/images/stepik/reviews/student-review-15.webp", alt: "Отзыв 15" },
  { src: "/images/stepik/reviews/student-review-16.webp", alt: "Отзыв 16" },
  { src: "/images/stepik/reviews/student-review-17.webp", alt: "Отзыв 17" },
  { src: "/images/stepik/reviews/student-review-18.webp", alt: "Отзыв 18" },
  { src: "/images/stepik/reviews/student-review-19.webp", alt: "Отзыв 19" },
  { src: "/images/stepik/reviews/student-review-20.webp", alt: "Отзыв 20" },
];

/**
 * Отзывы с картинками для Product JSON-LD (schema.org Review).
 * Используются на страницах курсов в buildProductJsonLd.
 * Картинки — те же скриншоты, что и в блоке отзывов на странице.
 */
export const PRODUCT_REVIEWS: ReviewForSchema[] = [
  {
    author: "Ученица курса",
    datePublished: "2024-09-15",
    reviewBody:
      "Курс помог системно подготовиться к ЕГЭ по химии. Структура от простого к сложному, много практики с автопроверкой. Рекомендую.",
    ratingValue: 5,
    image: "/images/stepik/reviews/student-review-01.webp",
  },
  {
    author: "Выпускник",
    datePublished: "2024-08-20",
    reviewBody:
      "Очень понятные объяснения и удобная платформа. За полгода занятий вырос с нуля до уверенного решения заданий.",
    ratingValue: 5,
    image: "/images/stepik/reviews/student-review-02.webp",
  },
  {
    author: "Студент",
    datePublished: "2024-07-10",
    reviewBody:
      "Понравился формат: короткие видео и сразу практика. Материал усваивается быстрее, чем по учебникам.",
    ratingValue: 5,
    image: "/images/stepik/reviews/student-review-03.webp",
  },
  {
    author: "Ученик",
    datePublished: "2024-06-05",
    reviewBody:
      "Готовился к ЕГЭ только по этому курсу. Результат превзошёл ожидания, поступил в вуз на бюджет.",
    ratingValue: 5,
    image: "/images/stepik/reviews/student-review-04.webp",
  },
  {
    author: "Родитель",
    datePublished: "2024-05-22",
    reviewBody:
      "Дочь занималась с нуля. Поддержка в чате и автопроверка заданий очень помогли. Рекомендую как альтернативу репетитору.",
    ratingValue: 5,
    image: "/images/stepik/reviews/student-review-05.webp",
  },
];
