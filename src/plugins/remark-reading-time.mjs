// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutes = Math.max(
			1,
			Math.round(readingTime.minutes),
		);
		data.astro.frontmatter.words = readingTime.words;

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
		data.astro.frontmatter.imageCount = imageCount;
	};
}
