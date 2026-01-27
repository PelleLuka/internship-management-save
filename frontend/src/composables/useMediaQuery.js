import { onScopeDispose, ref } from "vue";

/**
 * Reactive media query composable.
 * Watches a media query and returns a reactive boolean indicating if it matches.
 * 
 * @param {string} query - The media query string (e.g., "(min-width: 768px)").
 * @returns {import("vue").Ref<boolean>} A reactive reference that is true if the media query matches.
 */
export function useMediaQuery(query) {
	const matches = ref(false);

	if (typeof window !== "undefined") {
		const media = window.matchMedia(query);
		matches.value = media.matches;

		const onChange = () => {
			matches.value = media.matches;
		};

		media.addEventListener("change", onChange);

		onScopeDispose(() => {
			media.removeEventListener("change", onChange);
		});
	}

	return matches;
}
