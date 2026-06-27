<script lang="ts">
import Icon from "@iconify/svelte";
import { currentLang, switchLang } from "@i18n/client";
import { onMount } from "svelte";
import type { SupportedLang } from "@utils/lang-utils";

let lang: SupportedLang = $state("en");

onMount(() => {
	const unsub = currentLang.subscribe((v) => (lang = v));
	return unsub;
});

function toggle() {
	switchLang(lang === "en" ? "zh_CN" : "en");
}

function showPanel() {
	document.querySelector("#lang-panel")?.classList.remove("float-panel-closed");
}

function hidePanel() {
	document.querySelector("#lang-panel")?.classList.add("float-panel-closed");
}
</script>

<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button
		aria-label="Switch Language"
		role="menuitem"
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
		id="lang-switch"
		onclick={toggle}
		onmouseenter={showPanel}
	>
		<Icon icon="material-symbols:translate-rounded" class="text-[1.25rem]" />
	</button>

	<div id="lang-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
		<div class="card-base float-panel p-2">
			<button
				class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
				class:current-theme-btn={lang === "en"}
				onclick={() => switchLang("en")}
			>
				<span class="text-[1.25rem] mr-3">EN</span>
				English
			</button>
			<button
				class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
				class:current-theme-btn={lang === "zh_CN"}
				onclick={() => switchLang("zh_CN")}
			>
				<span class="text-[1.25rem] mr-3">中</span>
				中文
			</button>
		</div>
	</div>
</div>
