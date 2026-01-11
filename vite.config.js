import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"index":{"outputDir":"./","lang":"en","title":"","cacheVersion":114,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<style>\n.card {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 12px;\n  padding: 24px;\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  min-height: 200px;\n  width: 100%;\n  max-width: 400px;\n}\n\n.card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);\n  transition: all 0.25s ease;\n}\n\n\n.steps-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  align-items: center;\n  justify-content: flex-start;\n  margin-top: 40px;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: 12px;\n  padding: 24px;\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  width: 100%;\n  max-width: 400px;\n  transition: all 0.25s ease;\n}\n\n.card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);\n}\n\n.card h4 {\n  font-size: 18px;\n  color: #111827;\n  font-weight: 700;\n  margin: 0;\n}\n\n.card p {\n  font-size: 15px;\n  color: #64748b;\n  line-height: 1.5;\n  margin: 0;\n}\n</style>\n<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-11562994708\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'AW-11562994708');\n</script>\n<script type=\"text/javascript\">\n(function(c,l,a,r,i,t,y){\n    c[a]=c[a]||function(){ (c[a].q=c[a].q||[]).push(arguments) };\n    t=l.createElement(r); t.async=1; t.src=\"https://www.clarity.ms/tag/i6yx6ev3m9\";\n    y=l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t,y);\n})(window, document, \"clarity\", \"script\");\n</script>\n","body":"<script>\n(function () {\n  function findHeader() {\n    return document.getElementById(\"wwHeader\");\n  }\n\n  function getScrollContainer() {\n    // WeWeb/SPA часто скроллится внутри контейнера, не окна\n    const candidates = [\n      document.querySelector(\".ww-app\"),\n      document.querySelector(\"[class*='ww']\"),\n      document.querySelector(\"main\"),\n      document.scrollingElement,\n      document.documentElement,\n      document.body\n    ].filter(Boolean);\n\n    let best = window;\n    let bestScrollable = 0;\n\n    for (const el of candidates) {\n      if (el === document.body || el === document.documentElement || el === document.scrollingElement) {\n        // эти элементы обычно зеркалят window, не мешаем\n        continue;\n      }\n      const scrollable = (el.scrollHeight || 0) - (el.clientHeight || 0);\n      if (scrollable > bestScrollable) {\n        bestScrollable = scrollable;\n        best = el;\n      }\n    }\n\n    // если реально есть что скроллить — используем контейнер, иначе window\n    return bestScrollable > 0 ? best : window;\n  }\n\n  function getY(target) {\n    if (target === window) return window.pageYOffset || 0;\n    return target.scrollTop || 0;\n  }\n\n  function init() {\n    const header = findHeader();\n    if (!header) return false;\n\n    const scrollTarget = getScrollContainer();\n\n    let lastY = getY(scrollTarget);\n    let hidden = false;\n    let ticking = false;\n\n    const TOP_SAFE = 8;\n    const DELTA = 6; // меньше порог — быстрее реагирует\n\n    function apply(show) {\n      if (show) {\n        header.classList.remove(\"is-hidden\");\n        hidden = false;\n      } else {\n        header.classList.add(\"is-hidden\");\n        hidden = true;\n      }\n    }\n\n    function onScroll() {\n      const y = getY(scrollTarget);\n      const dy = y - lastY;\n\n      // у самого верха — всегда показываем\n      if (y <= TOP_SAFE) {\n        apply(true);\n        lastY = y;\n        return;\n      }\n\n      // вниз — прячем, вверх — показываем\n      if (dy > DELTA && !hidden) apply(false);\n      if (dy < -DELTA && hidden) apply(true);\n\n      lastY = y;\n    }\n\n    function rafScroll() {\n      if (ticking) return;\n      ticking = true;\n      requestAnimationFrame(() => {\n        onScroll();\n        ticking = false;\n      });\n    }\n\n    window.addEventListener(\"scroll\", rafScroll, { passive: true });\n    if (scrollTarget !== window) scrollTarget.addEventListener(\"scroll\", rafScroll, { passive: true });\n\n    // стартовое состояние\n    onScroll();\n\n    return true;\n  }\n\n  // ВАЖНО: WeWeb может отрисовать header позже DOMContentLoaded.\n  // Поэтому пробуем инициализироваться несколько раз.\n  document.addEventListener(\"DOMContentLoaded\", () => {\n    if (init()) return;\n    let tries = 0;\n    const t = setInterval(() => {\n      tries++;\n      if (init() || tries > 50) clearInterval(t); // ~5 секунд максимум\n    }, 100);\n  });\n})();\n</script>\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://2b8630d6-992f-4cd1-b2c3-9e4f16d1f205.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://2b8630d6-992f-4cd1-b2c3-9e4f16d1f205.weweb-preview.io/"}]}};

// Read the main HTML template
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
const compiledTemplate = handlebars.compile(template);

// Generate an HTML file for each page with its metadata
Object.values(pages).forEach(pageConfig => {
    // Compile the template with page metadata
    const html = compiledTemplate({
        title: pageConfig.title,
        lang: pageConfig.lang,
        meta: pageConfig.meta,
        structuredData: pageConfig.structuredData || null,
        scripts: {
            head: pageConfig.scripts.head,
            body: pageConfig.scripts.body,
        },
        alternateLinks: pageConfig.alternateLinks,
        cacheVersion: pageConfig.cacheVersion,
        baseTag: pageConfig.baseTag,
    });

    // Save output html for each page
    if (!fs.existsSync(pageConfig.outputDir)) {
        fs.mkdirSync(pageConfig.outputDir, { recursive: true });
    }
    fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
});

const rollupOptionsInput = {};
for (const pageName in pages) {
    rollupOptionsInput[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

export default defineConfig(() => {
    return {
        plugins: [nodePolyfills({ include: ['events', 'stream', 'string_decoder'] }), vue()],
        base: "/",
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [autoprefixer],
            },
        },
        build: {
            chunkSizeWarningLimit: 10000,
            rollupOptions: {
                input: rollupOptionsInput,
                onwarn: (entry, next) => {
                    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
                    return next(entry);
                },
                maxParallelFileOps: 900,
            },
        },
        logLevel: 'warn',
    };
});
