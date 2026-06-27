// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		let imageCount = 0;
		const visit = (node) => {
			if (node.type === "image" || node.type === "html" && /<img\s/.test(node.value || "")) {
				imageCount++;
			}
			if (node.children) {
				for (const child of node.children) visit(child);
			}
		};
		visit(tree);

		const imageTimeMinutes = (imageCount * 10) / 60;
		const totalMinutes = readingTime.minutes + imageTimeMinutes;

		data.astro.frontmatter.minutes = Math.max(1, Math.round(totalMinutes));
		data.astro.frontmatter.words = readingTime.words;
		data.astro.frontmatter.imageCount = imageCount;
	};
}
