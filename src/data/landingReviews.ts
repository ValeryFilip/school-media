import type { RealReview } from "./realReviews";
import { TUTORING_REVIEWS, type TutoringReview } from "./reviews-page";

const reviewById = new Map(TUTORING_REVIEWS.map((review) => [review.id, review]));

function toLandingReview(
  id: number,
  overrides: Partial<RealReview> = {},
): RealReview {
  const review = reviewById.get(id);
  if (!review) {
    throw new Error(`Review ${id} is missing in TUTORING_REVIEWS`);
  }

  return {
    entranceScore: review.before,
    egeScore: review.after,
    university: [review.tag, review.exam].filter(Boolean).join(" · "),
    studentName: review.name,
    studentPhoto: review.photo,
    telegramUrl: review.socialUrl ?? "#",
    telegramLink:
      review.social === "vk" ? "VK · открыть профиль" : "Открыть профиль",
    reviewText: review.text,
    footerPhoto1: review.screenImages?.[0] ?? "",
    footerPhoto2: review.screenImages?.[1] ?? "",
    ...overrides,
  };
}

export const egeNinthGradeReviews: RealReview[] = [
  toLandingReview(9, {
    university: "Минигруппа · подготовка с 9 класса",
    scoreStartLabel: "старт",
    scoreEndLabel: "ЕГЭ",
  }),
  toLandingReview(10, {
    university: "Минигруппа · подготовка с 9 класса",
    scoreStartLabel: "старт",
    scoreEndLabel: "ЕГЭ",
  }),
  toLandingReview(11, {
    university: "Минигруппа · подготовка с 9 класса",
    scoreStartLabel: "старт",
    scoreEndLabel: "ЕГЭ",
  }),
];

export const ogeReviews: RealReview[] = [18, 15, 3, 2, 16].map((id) =>
  toLandingReview(id, {
    university: `${reviewById.get(id)?.tag ?? "Занятия"} · 9 класс`,
    scoreStartLabel: "оценка до",
    scoreEndLabel: "ОГЭ",
    scoreDeltaText:
      typeof reviewById.get(id)?.before === "number" &&
      typeof reviewById.get(id)?.after === "number"
        ? `ОЦЕНКА ${reviewById.get(id)!.before} → ${reviewById.get(id)!.after}`
        : "РЕЗУЛЬТАТ ОГЭ",
  }),
);

const grade10ReviewIds = [1, 4, 7, 17];

export const grade10Reviews: RealReview[] = grade10ReviewIds.map((id) => {
  const review = reviewById.get(id) as TutoringReview;
  return toLandingReview(id, {
    university: `${review.tag ?? "Занятия"} · 10 класс`,
    resultText: "Понимание школьной химии и база для ЕГЭ",
    scoreDeltaText: "ОТЗЫВ УЧЕНИКА 10 КЛАССА",
  });
});
