export const VALID = {
  locales: ["en", "es"],
  ages: ["items", "kids"],
  animations: ["on", "off"],
};

export const DEFAULTS = {
  locale: "en",
  age: "items",
  animations: "on",
};

export function parseSettingsFromUrl(location = window.location) {
  const params = new URLSearchParams(location.search);
  const segments = location.pathname.split("/").filter(Boolean);
  const [segLocale, segAge, ...restSegments] = segments;

  const qpLocale = params.get("locale");
  const qpAge = params.get("age");
  const qpAnimations = params.get("animations");

  const locale =
    (segLocale && VALID.locales.includes(segLocale)) ? segLocale :
    (qpLocale && VALID.locales.includes(qpLocale)) ? qpLocale :
    DEFAULTS.locale;

  const age =
    (segAge && VALID.ages.includes(segAge)) ? segAge :
    (qpAge && VALID.ages.includes(qpAge)) ? qpAge :
    DEFAULTS.age;

  const animations =
    (qpAnimations && VALID.animations.includes(qpAnimations)) ? qpAnimations :
    DEFAULTS.animations;

  return { locale, age, animations, restSegments };
}

export function buildUrl(next, location = window.location) {
  const { restSegments } = parseSettingsFromUrl(location);

  const locale = VALID.locales.includes(next?.locale) ? next.locale : DEFAULTS.locale;
  const age = VALID.ages.includes(next?.age) ? next.age : DEFAULTS.age;
  const animations = VALID.animations.includes(next?.animations) ? next.animations : DEFAULTS.animations;

  const path = "/" + [locale, age, ...restSegments].join("/") + "/";

  const params = new URLSearchParams();
  if (animations === "off") {
    params.set("animations", "off");
  }

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}