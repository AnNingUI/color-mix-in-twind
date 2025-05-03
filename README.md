> [!IMPORTANT]
 > The reason this project was created was that [`twind`](https://www.npmjs.com/package/twind) couldn't use the `color/opacity` modifier, but it was implemented in [`@twind/core`](https://www.npmjs.com/package/@twind/core), so I archived this repository.
 
 ----

# color-mix-in-twind

A **Lit + Twind** demo that shows how to convert `bg-blue-500/50`-style classes into `bg-[rgba(...)]` at runtime. This is useful for debugging Twind’s lack of support for opacity modifier syntax.

---

## 💡 Why `color-mix-in-twind`?

Tailwind CSS v4 introduced `color-mix()` support, but there are two key drawbacks:

- ❌ Not supported in older browsers like Safari <15.4  
- ❌ `/opacity` syntax (e.g. `bg-blue-500/50`) is not compatible with Twind

This demo introduces a workaround using a utility function `twMix`, which transforms:

```ts
import { twMix } from './colorMix.ts'
html`<div class=${twMix`bg-blue-500/50`}></div>`

// in Web Components(Lit):
import { create, cssomSheet } from "twind";
import { createTw } from "./colorMix.ts";

const sheet = cssomSheet({ target: new CSSStyleSheet() });
const { tw } = create({ sheet });
const twMix = createTw(tw);

...
return html`
    <div class=${twMix`bg-blue-500/50`}></div>
`
...

```
to
```ts
html`<div class=${tw`bg-[rgba(59,130,246,0.5)]`}></div>`
```

Into:

```html
<div class="bg-[rgba(59,130,246,0.5)]"></div>

<style>
    .bg-\[rgba\(59\,130\,246\,0\.5\)\] {
        background-color: rgba(59, 130, 246, 0.5);
    }
</style>
```

---

## ✅ What `twMix` Does

- Parses Tailwind color + opacity classes (e.g., `bg-red-400/60`)
- Looks up RGB values from the Tailwind color palette
- Converts them to `rgba(...)` format
- Returns valid Twind-compatible class strings like `bg-[rgba(...)]`

---

## 📁 Project Structure

- [`src/my-element.ts`](./src/my-element.ts) — A Lit component using `twMix`  
- [`src/colorMix.ts`](./src/colorMix.ts) — The implementation of the runtime converter

---

## ▶️ How to Run

This project uses [Vite](https://vitejs.dev/) as the dev server:

```bash
npm install
npm run dev
```

Then open the local development server URL (usually `http://localhost:5173`).

---

## 🚫 Not for Production

This project is **not** intended to be published or reused as a library.  
It exists only to provide a minimal reproduction case for issues related to Twind and opacity modifiers.

---

## 📄 License

MIT
