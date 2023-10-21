const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const { minify } = require('terser');

module.exports = function(eleventyConfig) {
    eleventyConfig.addCollection('en_items', (collection) => collection.getFilteredByGlob('./src/en/items/**/index.md'));
    eleventyConfig.addCollection('es_items', (collection) => collection.getFilteredByGlob('./src/es/items/**/index.md'));
    eleventyConfig.addCollection('en_kids', (collection) => collection.getFilteredByGlob('./src/en/kids/**/index.md'));
    eleventyConfig.addCollection('es_kids', (collection) => collection.getFilteredByGlob('./src/es/kids/**/index.md'));
    eleventyConfig.addFilter('asPostDate', (dateObj, locale) =>
        DateTime
        .fromJSDate(dateObj)
        .setLocale(locale)
        .toLocaleString({
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }));
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
