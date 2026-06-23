import { egeLandingData } from "./egeLanding";

export const tutorLandingData = {
  pageTitle: "Репетитор по химии онлайн — Валерий Филипенко",
  nav: {
    ...egeLandingData.nav,
    logoAlt: "ЕГЭХИМ — репетитор по химии",
    meta: "/ репетитор",
    landingLinks: [
      { href: "#author", label: "Обо мне" },
      { href: "#method", label: "Методика" },
      { href: "#services", label: "Услуги" },
      { href: "#reviews", label: "Отзывы" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: {
      label: "Написать",
      popupId: "lead-popup",
      source: "tutor-menu",
      variant: "desktop",
      campaign: "tutor",
    },
  },
  footer: {
    ...egeLandingData.footer,
    cta: {
      ...egeLandingData.footer.cta,
      campaign: "tutor",
    },
  },
  floatingActions: egeLandingData.floatingActions,
  popupForm: {
    ...egeLandingData.popupForm,
    title: "Пробное занятие",
    eyebrow: "// репетитор · заявка",
    submitText: "Отправить заявку →",
    formType: "popup-tutor",
  },
};

export type TutorLandingData = typeof tutorLandingData;
