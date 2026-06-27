<script lang="ts">
import Icon from "@iconify/svelte";
import { currentLang, switchLang } from "@i18n/client";
import { onMount } from "svelte";
import type { SupportedLang } from "@utils/lang-utils";
import { getLangDisplayName } from "@utils/lang-utils";

let lang: SupportedLang = $state("en");

onMount(() => {
	const unsub = currentLang.subscribe((v) => (lang = v));
	return unsub;
});

const allLangs: SupportedLang[] = ["en", "zh_CN", "zh_TW", "ja", "ko", "es", "id", "th", "tr", "vi"];

function showPanel() {
	document.querySelector("#lang-panel")?.classList.remove("float-panel-closed");
}

function hidePanel() {
	document.querySelector("#lang-panel")?.classList.add("float-panel-closed");
}

function selectLang(l: SupportedLang) {
	switchLang(l);
	hidePanel();
}
</script>

<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button
		aria-label="Switch Language"
		role="menuitem"
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
		id="lang-switch"
		onmouseenter={showPanel}
		onclick={showPanel}
	>
		<Icon icon="material-symbols:translate-rounded" class="text-[1.25rem]" />
	</button>

	<div id="lang-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
		<div class="card-base float-panel p-2 max-h-80 overflow-y-auto">
			{#each allLangs as l}
				{@const info = getLangDisplayName(l)}
				<button
					class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
					class:current-theme-btn={lang === l}
					onclick={() => selectLang(l)}
				>
					<span class="text-[1.25rem] mr-3 w-6 text-center">{info.short}</span>
					{info.full}
				</button>
			{/each}
		</div>
	</div>
</div>
