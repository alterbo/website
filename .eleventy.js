import { DateTime } from 'luxon';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import sanitizeHtml from 'sanitize-html';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loadJSON = (relPath) => JSON.parse(fs.readFileSync(path.join(__dirname, relPath), 'utf-8'));
const I18N = {
    en: loadJSON('./src/_data/i18n/en.json'),
    es: loadJSON('./src/_data/i18n/es.json'),
};
const getByPath = (obj, dotPath) => dotPath.split('.').reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, obj);

const CATEGORY_ALIASES = {
    app: 'app',
    comic: 'comic',
    'cómic': 'comic',
    poetry: 'poetry',
    poesia: 'poetry',
    'poesía': 'poetry',
    tale: 'tale',
    cuento: 'tale',
};

export default function (eleventyConfig) {

    // Assets are copied to the output first, then Vite (via the plugin)
    // post-processes HTML to replace entrypoints with hashed/minified bundles.
    eleventyConfig.addPassthroughCopy('src/assets');
    
    const locales = ['en', 'es'];
    const ages = ['items', 'kids'];
    const types = ages;
    const categories = ['comic','app','poetry','tale'];

    locales.forEach(locale => {
        types.forEach(type => {
            categories.forEach(cat => {
                const name = `${locale}_${type}_${cat}`;
                const glob = `./src/${locale}/${type}/${cat}/**/index.md`;
                eleventyConfig.addCollection(name, (collection) => collection.getFilteredByGlob(glob));
            });
        });
    });

    eleventyConfig.addFilter('asPostDate', (dateObj, locale) =>
        DateTime
        .fromJSDate(dateObj)
        .setLocale(locale)
        .toLocaleString({
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }));

    eleventyConfig.addFilter('categoryFilter', function(collection, category) {
        if (!category) return collection;
        const categoryFormatted = category.toLowerCase();
        return collection.filter(item => String(item.data.category).toLowerCase() === categoryFormatted);
    });

    eleventyConfig.addFilter('range', function (start, end) {
        return Array.from({ length: end - start }, (_, i) => start + i);
    });

    eleventyConfig.addFilter('assetPath', function(path) {
        return path;
    });

    eleventyConfig.addFilter('makePath', function(locale, age) {
        const safeLocale = locales.includes(locale) ? locale : locales[0];
        const safeAge = ages.includes(age) ? age : 'items';
        return `/${safeLocale}/${safeAge}/`;
    });

    eleventyConfig.addFilter('t', function(key, locale) {
        const lang = ['en','es'].includes(locale) ? locale : 'en';
        const normalizedKey = key.toLowerCase();
        let value = getByPath(I18N[lang], normalizedKey);
        if (value === undefined) value = getByPath(I18N.en, normalizedKey);
        if (value === undefined) {
            // Provide a visible marker for missing translations without breaking build
            return `[missing:${normalizedKey}]`;
        }
        return value;
    });

    // Merge all category collections for a given locale + age
    eleventyConfig.addFilter('mergeCollections', function(collectionsObj, locale, age) {
        if (!collectionsObj) return [];
        const prefix = `${String(locale).toLowerCase()}_${String(age || 'items').toLowerCase()}_`;
        const merged = Object.entries(collectionsObj)
            .filter(([name]) => name.startsWith(prefix))
            .flatMap(([, arr]) => Array.isArray(arr) ? arr : []);
        const seen = new Set();
        const unique = [];
        for (const item of merged) {
            const key = item && item.url;
            if (key && !seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }
        return unique;
    });

    eleventyConfig.addFilter('sampleRelated', function(collection, slugs = [], excludeUrl = undefined, n = 3) {
        const items = Array.isArray(collection) ? collection : [];
        const clean = items.filter(item => excludeUrl ? item?.url !== excludeUrl : true);

        // Accept either an array of slugs or an object {category: [slugs]}
        let recSet = null;
        if (Array.isArray(slugs)) {
            if (slugs.length) recSet = new Set(slugs.map(String));
        } else if (slugs && typeof slugs === 'object') {
            const flat = Object.values(slugs).flatMap(a => Array.isArray(a) ? a : []);
            if (flat.length) recSet = new Set(flat.map(String));
        }

        let pool = clean;
        if (recSet) {
            const preferred = clean.filter(item => recSet.has(String(item.fileSlug)));
            if (preferred.length) pool = preferred;
        }

        // Pick up to n randomly from the pool, then top up from clean
        const shuffled = pool.slice().sort(() => Math.random() - 0.5);
        let picked = shuffled.slice(0, Math.min(n, shuffled.length));
        if (picked.length < n) {
            const remainder = clean
                .filter(i => !picked.some(p => p.url === i.url))
                .sort(() => Math.random() - 0.5)
                .slice(0, n - picked.length);
            picked = picked.concat(remainder);
        }

        // Sort newest first by item.date
        picked.sort((a, b) => {
            const da = a?.date instanceof Date ? a.date.getTime() : new Date(a?.date).getTime();
            const db = b?.date instanceof Date ? b.date.getTime() : new Date(b?.date).getTime();
            return db - da;
        });

        return picked;
    });

    eleventyConfig.addFilter('sanitizeHtml', (html) =>
        sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'img', 'h1', 'h2',
                'svg', 'g', 'path', 'rect', 'circle', 'line', 'ellipse',
                'polyline', 'polygon', 'use', 'defs', 'symbol', 'clipPath',
                'linearGradient', 'radialGradient', 'stop',
                'text', 'tspan', 'title', 'desc'
            ]),
            allowedAttributes: {
                a: ['href', 'name', 'target', 'rel'],
                img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
                svg: ['xmlns', 'xml:space', 'viewBox', 'width', 'height', 'class', 'id', 'aria-hidden'],
                g: ['class', 'id', 'transform'],
                path: ['class', 'id', 'd', 'transform', 'fill', 'stroke', 'stroke-width'],
                circle: ['class', 'id', 'cx', 'cy', 'r', 'transform', 'fill', 'stroke', 'stroke-width'],
                rect: ['class', 'id', 'x', 'y', 'width', 'height', 'rx', 'ry', 'transform'],
                line: ['class', 'id', 'x1', 'y1', 'x2', 'y2', 'transform'],
                ellipse: ['class', 'id', 'cx', 'cy', 'rx', 'ry', 'transform'],
                polyline: ['class', 'id', 'points', 'transform'],
                polygon: ['class', 'id', 'points', 'transform'],
                '*': ['class']
            },
            allowedSchemes: ['http', 'https'],
            allowedSchemesByTag: {
                img: ['http', 'https', 'data']
            },
            parser: {
                lowerCaseTags: false,
                lowerCaseAttributeNames: false
            }
        })
    );

    eleventyConfig.addFilter('categoryKey', function (category) {
        const raw = String(category ?? '').trim().toLowerCase();
        return CATEGORY_ALIASES[raw] ?? raw;
    });

    eleventyConfig.addPlugin(EleventyVitePlugin);

    return {
        dir: {
            input: 'src',
            output: 'dist',
        },
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        templateFormats: ['html', 'njk', 'md'],
    }
}
