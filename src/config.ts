import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "My ",
	subtitle: " Mods",
	lang: "en",
	themeColor: {
		hue: 200,
		fixed: false,
	},
	banner: {
		enable: true,
		position: "center",
		dotsBottom: "4rem",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "Discord",
			url: "https://discord.gg/jfzkHZu8QV",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	name: "MengYYY",
	bio: "DayZ Mod Author",
	links: [
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "https://discord.gg/jfzkHZu8QV",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/id/MengYYY666/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/MengYYY369",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
