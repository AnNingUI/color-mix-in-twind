/**
 * @author AnNingUI
 */

import { formatRgb, parse } from "culori";
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

const getTw = (__tw?: TW) => __tw || _tw;

const hex2rgba = (hex: string) => {
	hex = hex.replace(/^#/, "");
	if (hex.length === 3) {
		const [r, g, b] = hex.split("").map((c) => parseInt(c + c, 16));
		return { r, g, b, a: 1 };
	}
	if (hex.length === 4) {
		const [r, g, b, a] = hex.split("").map((c) => parseInt(c + c, 16));
		return { r, g, b, a: Number((a / 255).toFixed(3)) };
	}
	if (hex.length === 6) {
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return { r, g, b, a: 1 };
	}
	if (hex.length === 8) {
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const a = parseInt(hex.slice(6, 8), 16);
		return { r, g, b, a: Number((a / 255).toFixed(3)) };
	}
	return { r: 0, g: 0, b: 0, a: 1 };
};

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

const processToken = (token: string, _tw?: TW): string => {
	const __tw = getTw(_tw);
	const match = token.match(COLOR_REGEX);
	if (!match) return __tw(token);

	const [_, variants, prefix, colorNameRaw, __, opacityStr] = match;
	if (colorNameRaw.startsWith("[") && colorNameRaw.endsWith("]")) {
		console.log("[JIT] opacityStr", opacityStr);
		if (!opacityStr) return __tw(token);

		const rawColor = colorNameRaw.slice(1, -1);
		const alpha = Number(opacityStr) / 100;
		const cacheKey = `${rawColor}/${alpha}`;

		const cached = colorCache.get(cacheKey);
		if (cached) return __tw`${variants}${prefix}-[${cached}]`;

		const parsed = parse(rawColor);
		if (!parsed) return __tw(token);

		parsed.alpha = alpha;
		const result = formatRgb(parsed).replace(/\s/g, "");
		colorCache.set(cacheKey, result);
		return __tw`${variants}${prefix}-[${result}]`;
	}
	const [colorName, _shadeStr] = colorNameRaw.split("-");
	if (!(colorName in colors)) {
		return __tw(token);
	}

	const colorValue = colors[colorName as keyof typeof colors];
	let colorHex: string;

	if (_shadeStr) {
		const shade = parseInt(_shadeStr, 10) as ColorJ;
		if (typeof colorValue !== "object" || !(shade in colorValue)) {
			return __tw(token);
		}
		colorHex = colorValue[shade];
	} else {
		if (typeof colorValue !== "string") {
			return __tw(token);
		}
		colorHex = colorValue;
	}

	const alpha = opacityStr ? Number(opacityStr) / 100 : 1;
	const { r, g, b } = hex2rgba(colorHex);
	const r2 = __tw`${variants}${prefix}-[rgba(${r},${g},${b},${alpha})]`;
	console.log("r", r2);
	return __tw`${variants}${prefix}-[rgba(${r},${g},${b},${alpha})]`;
};

// 支持模板字符串
export const createTw = (__tw: TW) => {
	return (strings: TemplateStringsArray, ...values: any[]) =>
		__tw(
			strings
				.reduce((acc, str, i) => acc + str + (values[i]?.toString() ?? ""), "")
				.split(/\s+/)
				.filter(Boolean)
				.map((t) => processToken(t, __tw))
				.join(" ")
		);
};

export const twMix = createTw(_tw);
