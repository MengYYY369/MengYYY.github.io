const LANG_KEY = "lang";
const SUPPORTED_LANGS = ["en", "zh_CN"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export function detectBrowserLang(): SupportedLang {
	const nav = navigator.language?.toLowerCase() || "";
	if (nav.startsWith("zh")) return "zh_CN";
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
	document.documentElement.lang = lang === "zh_CN" ? "zh-CN" : "en";
}
