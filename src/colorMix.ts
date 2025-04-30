/**
 * @author
 */

import { converter, formatRgb, parse } from "culori";
import { type TW, tw as _tw } from "twind";
import * as colors from "twind/colors";

type ColorJ = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

const COLOR_REGEX = new RegExp(
	"^" +
		"(.*?)" +
		"(bg|text|border|ring|stroke|fill|accent|from|via|to)-" +
		"(" +
		"[a-zA-Z-]+-\\d+" +
		"|" +
		"\\[([a-zA-Z0-9(),.%\\[\\]#\\s]+)\\]" +
		")" +
		"(?:/(\\d+))?" +
		"$"
);

const rgbaConverter = converter("rgb");

// LRU 缓存实现
class ColorCache {
	private map = new Map<string, string>();
	constructor(private maxSize = 100) {}

	get(key: string): string | undefined {
		const val = this.map.get(key);
		if (val) {
			this.map.delete(key);
			this.map.set(key, val); // move to end
		}
		return val;
	}

	set(key: string, value: string) {
		if (this.map.has(key)) this.map.delete(key);
		else if (this.map.size >= this.maxSize) {
			const first = this.map.keys().next().value;
			first && this.map.delete(first);
		}
		this.map.set(key, value);
	}
}

const colorCache = new ColorCache(100);

const processToken = (token: string): string => {
	const match = token.match(COLOR_REGEX);
	if (!match) return token;

	const [_, variants, prefix, colorNameRaw, __, opacityStr] = match;
	if (colorNameRaw.startsWith("[") && colorNameRaw.endsWith("]")) {
		// console.log("[JIT] opacityStr", opacityStr);
		if (!opacityStr) return token;

		const rawColor = colorNameRaw.slice(1, -1);
		const alpha = Number(opacityStr) / 100;
		const cacheKey = `${rawColor}/${alpha}`;

		const cached = colorCache.get(cacheKey);
		if (cached) return `${variants}${prefix}-[${cached}]`;

		const parsed = parse(rawColor);
		if (!parsed) return token;

		parsed.alpha = alpha;
		const result = formatRgb(parsed).replace(/\s/g, "");
		colorCache.set(cacheKey, result);
		return `${variants}${prefix}-[${result}]`;
	}
	const [colorName, _shadeStr] = colorNameRaw.split("-");
	if (!(colorName in colors)) {
		return token;
	}

	const colorValue = colors[colorName as keyof typeof colors];
	let colorHex: string;

	if (_shadeStr) {
		const shade = parseInt(_shadeStr, 10) as ColorJ;
		if (typeof colorValue !== "object" || !(shade in colorValue)) {
			return token;
		}
		colorHex = colorValue[shade];
	} else {
		if (typeof colorValue !== "string") {
			return token;
		}
		colorHex = colorValue;
	}

	const alpha = opacityStr ? Number(opacityStr) / 100 : 1;
	// console.log("colorHex", colorHex);
	const { r, g, b } = rgbaConverter(colorHex)!;
	return `${variants}${prefix}-[rgba(${r * 255},${g * 255},${
		b * 255
	},${alpha})]`;
};

// 支持模板字符串
export const createTw = (__tw: TW) => {
	return (strings: TemplateStringsArray, ...values: any[]) => {
		const raw = strings.reduce((a, s, i) => a + s + (values[i] ?? ""), "");
		const out = raw.match(/\S+/g)?.map(processToken).join(" ") ?? "";
		return __tw(out);
	};
};

export const twMix = createTw(_tw);
