const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const { minify } = require('terser');

module.exports = function(eleventyConfig) {
    const files = [
        'src/assets/favicon.ico',
    ];
    files.forEach((file) => eleventyConfig.addPassthroughCopy(file));
    eleventyConfig.addCollection('en_items_all', (collection) => collection.getFilteredByGlob('./src/en/items/**/index.md'));
    eleventyConfig.addCollection('en_items_comic', (collection) => collection.getFilteredByGlob('./src/en/items/comic/**/index.md'));
    eleventyConfig.addCollection('en_items_app', (collection) => collection.getFilteredByGlob('./src/en/items/app/**/index.md'));
    eleventyConfig.addCollection('en_items_poetry', (collection) => collection.getFilteredByGlob('./src/en/items/poetry/**/index.md'));
    eleventyConfig.addCollection('en_items_tale', (collection) => collection.getFilteredByGlob('./src/en/items/tale/**/index.md'));
    eleventyConfig.addCollection('en_kids_all', (collection) => collection.getFilteredByGlob('./src/en/kids/**/index.md'));
    eleventyConfig.addCollection('en_kids_app', (collection) => collection.getFilteredByGlob('./src/en/kids/app/**/index.md'));
    eleventyConfig.addCollection('en_kids_comic', (collection) => collection.getFilteredByGlob('./src/en/kids/comic/**/index.md'));
    eleventyConfig.addCollection('en_kids_poetry', (collection) => collection.getFilteredByGlob('./src/en/kids/poetry/**/index.md'));
    eleventyConfig.addCollection('en_kids_tale', (collection) => collection.getFilteredByGlob('./src/en/kids/tale/**/index.md'));
    eleventyConfig.addCollection('es_items_all', (collection) => collection.getFilteredByGlob('./src/es/items/**/index.md'));
    eleventyConfig.addCollection('es_items_comic', (collection) => collection.getFilteredByGlob('./src/es/items/comic/**/index.md'));
    eleventyConfig.addCollection('es_items_app', (collection) => collection.getFilteredByGlob('./src/es/items/app/**/index.md'));
    eleventyConfig.addCollection('es_items_poetry', (collection) => collection.getFilteredByGlob('./src/es/items/poetry/**/index.md'));
    eleventyConfig.addCollection('es_items_tale', (collection) => collection.getFilteredByGlob('./src/es/items/tale/**/index.md'));
    eleventyConfig.addCollection('es_kids_all', (collection) => collection.getFilteredByGlob('./src/es/kids/**/index.md'));
    eleventyConfig.addCollection('es_kids_app', (collection) => collection.getFilteredByGlob('./src/es/kids/app/**/index.md'));
    eleventyConfig.addCollection('es_kids_comic', (collection) => collection.getFilteredByGlob('./src/es/kids/comic/**/index.md'));
    eleventyConfig.addCollection('es_kids_poetry', (collection) => collection.getFilteredByGlob('./src/es/kids/poetry/**/index.md'));
    eleventyConfig.addCollection('es_kids_tale', (collection) => collection.getFilteredByGlob('./src/es/kids/tale/**/index.md'));
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
        const filtered = collection.filter(item => item.data.category == category)
        return filtered;
    });
    eleventyConfig.addFilter('cssmin', (code) => new CleanCSS({}).minify(code).styles);
    eleventyConfig.addFilter('range', function (start, end) {
        return Array.from({ length: end - start }, (_, i) => start + i);
      });
      
    eleventyConfig.addNunjucksAsyncFilter('jsmin', async function (
        code,
        callback
        ) {
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.error("Terser error: ", err);
            callback(null, code);
        }
        });
    eleventyConfig.addPassthroughCopy('./src/assets/images/');
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
