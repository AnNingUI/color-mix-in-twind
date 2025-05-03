/**
 * twMix Plugin for Twind
 * ---------------------------------
 * A runtime color-mixing solution for Twind,
 * inspired by Tailwind CSS v4's `color-mix()` support.
 * Converts opacity-based color syntax (e.g., `bg-blue-500/50`) into
 * equivalent `rgba()` values at runtime, ensuring compatibility
 * with browsers lacking native `color-mix()` and integrating seamlessly
 * with Twind's on-the-fly utility generation.
 */

import install from "@twind/with-web-components";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import config from "./twind.config";
const withTwind = install(config);
@customElement("my-element")
export class MyElement extends withTwind(LitElement) {
	render() {
		return html`
			<div class="bg-white p-8 max-w-4xl mx-auto rounded-xl shadow-lg">
				<!-- Header -->
				<h1
					class="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-2"
				>
					🎨 twMix - Runtime Color Mixing Solution for Twind
				</h1>

				<!-- Problem Statement -->
				<div class="bg-[#ff6644]/20 p-6 rounded-lg mb-8">
					<h2 class="text-xl font-semibold text-gray-700 mb-3">
						🚨 Why twMix?
					</h2>
					<p class="text-gray-600 mb-3">
						While Tailwind CSS v4’s
						<code class="font-mono bg-gray-100 px-1 rounded">
							color-mix()
						</code>
						enables color blending, it has two key drawbacks:
					</p>
					<ul class="list-disc pl-6 text-gray-600 space-y-2 mb-4">
						<li>❌ Lacks support in older browsers like Safari &lt;15.4</li>
						<li>
							❌ Although Twind is compatible, it is a bit inconvenient not to
							support this way of writing
						</li>
					</ul>
					<p class="text-gray-600">
						twMix solves these by converting opacity-based syntaxes (e.g.,
						<code class="font-mono bg-gray-100 px-1 rounded">
							bg-blue-500/50 </code
						>) into
						<code class="font-mono bg-gray-100 px-1 rounded">
							rgba(59,130,246,0.5)
						</code>
						at runtime, and preserving original classes when no opacity modifier
						is present.
					</p>
				</div>

				<!-- Solution -->
				<div class="mb-8">
					<h2 class="text-xl font-semibold text-gray-700 mb-4">
						💡 Our Solution
					</h2>
					<p class="text-gray-600 mb-4">
						twMix converts color mixing syntax to RGBA format at runtime:
					</p>
					<div class="bg-blue-500/50 p-4 rounded-lg">
						<code class="font-mono text-red-500">bg-blue-500/50</code> →
						<code class="font-mono text-blue-500">
							bg-[rgba(59,130,246,0.5)]
						</code>
					</div>
				</div>

				<!-- Features -->
				<div class="space-y-6">
					<!-- Basic Conversion -->
					<div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
						<h3 class="text-lg font-semibold text-gray-700 mb-3">
							✅ Basic Conversion
						</h3>
						<div class="bg-blue-500/10 p-4 rounded">
							<div class="flex gap-2 items-center">
								<span class="font-mono text-sm text-red-500"
									>bg-blue-500/10</span
								>
								<span class="text-gray-400">→</span>
								<span class="font-mono text-sm text-blue-500"
									>bg-[rgba(59,130,246,0.1)]</span
								>
							</div>
						</div>
					</div>

					<!-- Existing Class Preservation -->
					<div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
						<h3 class="text-lg font-semibold text-gray-700 mb-3">
							🔄 Standard Class Preservation
						</h3>
						<div class="bg-blue-500 p-4 rounded">
							<div class="flex gap-2 items-center">
								<span class="font-mono text-sm text-red-500">bg-blue-500</span>
								<span class="text-gray-400">→</span>
								<span class="font-mono text-sm text-blue-500"
									>bg-blue-500 (no change)</span
								>
							</div>
						</div>
					</div>

					<!-- Mixed Syntax Handling -->
					<div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
						<h3 class="text-lg font-semibold text-gray-700 mb-3">
							🧩 Mixed Syntax Support
						</h3>
						<div class="bg-[#bada55]/30 text-gray-600/90 p-4 rounded">
							<div class="flex flex-col gap-2">
								<div class="flex gap-2 items-center">
									<span class="font-mono text-sm text-red-500"
										>bg-[#bada55]/30</span
									>
									<span class="text-gray-400">→</span>
									<span class="font-mono text-sm text-blue-500"
										>bg-[rgba(186,218,85,0.3)]</span
									>
								</div>
								<div class="flex gap-2 items-center">
									<span class="font-mono text-sm text-red-500"
										>text-gray-600/90</span
									>
									<span class="text-gray-400">→</span>
									<span class="font-mono text-sm text-blue-500"
										>text-[rgba(71,85,105,0.9)]</span
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Pseudo-class Support -->
					<div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
						<h3 class="text-lg font-semibold text-gray-700 mb-3">
							🎛 Pseudo-class Handling
						</h3>
						<div
							class="hover:bg-emerald-400/20 dark:bg-gray-800/50 p-4 rounded"
						>
							<div class="flex flex-col gap-2">
								<div class="flex gap-2 items-center">
									<span class="font-mono text-sm text-red-500"
										>hover:bg-emerald-400/20</span
									>
									<span class="text-gray-400">→</span>
									<span class="font-mono text-sm text-blue-500"
										>hover-bg-[rgba(52,211,153,0.2)]</span
									>
								</div>
								<div class="flex gap-2 items-center">
									<span class="font-mono text-sm text-red-500"
										>dark:bg-gray-800/50</span
									>
									<span class="text-gray-400">→</span>
									<span class="font-mono text-sm text-blue-500"
										>dark-bg-[rgba(30,41,59,0.5)]</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Compatibility Notice -->
				<div class="mt-8 p-4 bg-green-50 rounded-lg">
					<h2 class="text-lg font-semibold text-green-700 mb-2">
						🌍 Browser Support
					</h2>
					<p class="text-green-600">
						Works in all modern browsers including Safari 13+ (unlike native
						color-mix()). Fallback to original classes if opacity value is
						missing.
					</p>
				</div>
			</div>
		`;
	}
}
