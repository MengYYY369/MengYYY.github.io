const LANG_KEY = "lang";
const SUPPORTED_LANGS = ["en", "zh_CN", "zh_TW", "ja", "ko", "es", "id", "th", "tr", "vi"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const LANG_DISPLAY_NAMES: Record<SupportedLang, { short: string; full: string }> = {
	en: { short: "EN", full: "English" },
	zh_CN: { short: "简", full: "简体中文" },
	zh_TW: { short: "繁", full: "繁體中文" },
	ja: { short: "日", full: "日本語" },
	ko: { short: "한", full: "한국어" },
	es: { short: "ES", full: "Español" },
	id: { short: "ID", full: "Indonesia" },
	th: { short: "ไท", full: "ภาษาไทย" },
	tr: { short: "TR", full: "Türkçe" },
	vi: { short: "VI", full: "Tiếng Việt" },
};

export function getLangDisplayName(lang: SupportedLang) {
	return LANG_DISPLAY_NAMES[lang];
}

const LANG_TAG_MAP: Record<SupportedLang, string> = {
	en: "en",
	zh_CN: "zh-CN",
	zh_TW: "zh-TW",
	ja: "ja",
	ko: "ko",
	es: "es",
	id: "id",
	th: "th",
	tr: "tr",
	vi: "vi",
};

export function detectBrowserLang(): SupportedLang {
	const nav = navigator.language?.toLowerCase() || "";
	if (nav.startsWith("zh-tw") || nav.startsWith("zh-hant")) return "zh_TW";
	if (nav.startsWith("zh")) return "zh_CN";
	if (nav.startsWith("ja")) return "ja";
	if (nav.startsWith("ko")) return "ko";
	if (nav.startsWith("es")) return "es";
	if (nav.startsWith("id")) return "id";
	if (nav.startsWith("th")) return "th";
	if (nav.startsWith("tr")) return "tr";
	if (nav.startsWith("vi")) return "vi";
	return "en";
}

export function getStoredLang(): SupportedLang {
	const stored = localStorage.getItem(LANG_KEY);
	if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) {
		return stored as SupportedLang;
	}
	return detectBrowserLang();
}

export function setLang(lang: SupportedLang): void {
	localStorage.setItem(LANG_KEY, lang);
	applyLangToDocument(lang);
}

export function applyLangToDocument(lang: SupportedLang): void {
	document.documentElement.lang = LANG_TAG_MAP[lang] || "en";
}
