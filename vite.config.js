import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"index":{"outputDir":"./","lang":"en","title":"","cacheVersion":74,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<style>\n.card {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 12px;\n  padding: 24px;\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  min-height: 200px;\n  width: 100%;\n  max-width: 400px;\n}\n\n.card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);\n  transition: all 0.25s ease;\n}\n\n\n.steps-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  align-items: center;\n  justify-content: flex-start;\n  margin-top: 40px;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: 12px;\n  padding: 24px;\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  width: 100%;\n  max-width: 400px;\n  transition: all 0.25s ease;\n}\n\n.card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);\n}\n\n.card h4 {\n  font-size: 18px;\n  color: #111827;\n  font-weight: 700;\n  margin: 0;\n}\n\n.card p {\n  font-size: 15px;\n  color: #64748b;\n  line-height: 1.5;\n  margin: 0;\n}\n</style>\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://2b8630d6-992f-4cd1-b2c3-9e4f16d1f205.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://2b8630d6-992f-4cd1-b2c3-9e4f16d1f205.weweb-preview.io/"}]}};

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
