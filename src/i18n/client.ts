import { writable } from "svelte/store";
import { en } from "./languages/en";
import { zh_CN } from "./languages/zh_CN";
import { zh_TW } from "./languages/zh_TW";
import { ja } from "./languages/ja";
import { ko } from "./languages/ko";
import { es } from "./languages/es";
import { id } from "./languages/id";
import { th } from "./languages/th";
import { tr } from "./languages/tr";
import { vi } from "./languages/vi";
import type I18nKey from "./i18nKey";
import type { SupportedLang } from "../utils/lang-utils";
import { getStoredLang, setLang as persistLang, applyLangToDocument } from "../utils/lang-utils";

const translations: Record<string, Record<string, string>> = {
	en,
	zh_CN,
	zh_TW,
	ja,
	ko,
	es,
	id,
	th,
	tr,
	vi,
};

export const currentLang = writable<SupportedLang>(
	typeof window !== "undefined" ? getStoredLang() : "en",
);

let _lang: SupportedLang = typeof window !== "undefined" ? getStoredLang() : "en";
currentLang.subscribe((v) => (_lang = v));

export function t(key: I18nKey): string {
	return translations[_lang]?.[key] ?? translations["en"][key];
}

export function switchLang(lang: SupportedLang): void {
	currentLang.set(lang);
	persistLang(lang);
	applyLangToDocument(lang);
	translateDOM();
}

export function translateDOM(): void {
	const dict = translations[_lang] ?? translations["en"];

	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n")!;
		if (dict[key] !== undefined) {
			el.textContent = dict[key];
		}
	});

	document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
		const key = el.getAttribute("data-i18n-placeholder")!;
		if (dict[key] !== undefined) {
			(el as HTMLInputElement).placeholder = dict[key];
		}
	});
}
