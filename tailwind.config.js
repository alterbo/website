module.exports = {
    content: ["./src/**/*.{njk,md}", "./src/**/*.svg"],
    theme: {
      extend: {
        gridTemplateColumns: {
          'lol': '33vw auto 1fr',
        },
        gridTemplateRows: {
          'lol': '100px auto',
          'nonlol': 'auto',
          'pink-floyd': 'repeat(2, auto 1fr)',
        },
        maxWidth: {
          'settings-full': 'calc(100vw - 3.5rem - 4px)'
        }
      },
    },
    plugins: [],
  }
