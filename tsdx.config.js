const rollup_plugin_terser_1 = require('rollup-plugin-terser');
module.exports = {
  rollup(config, opts) {
    config.plugins = config.plugins.map(p => {
      if (p.name === 'terser') {
        return rollup_plugin_terser_1.terser({
          sourcemap: true,
          output: { comments: false },
          compress: {
            passes: 10,
            // keep_infinity: true,
            pure_getters: true,
            unsafe_methods: true,
            unsafe_arrows: true,
            side_effects: false,
          },
          mangle: {
            toplevel: true,
            properties: {
              regex: /^_/,
            },
          },
          ecma: 6,
          //   toplevel: false,
          warnings: true,
        });
      }

      return p;
    });

    return config;
  },
};
