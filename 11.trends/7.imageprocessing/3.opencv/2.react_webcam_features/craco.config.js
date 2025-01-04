module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify the rule that uses source-map-loader
      const rules = webpackConfig.module.rules;
      
      const sourceMapRule = rules.find(
        rule => rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')
      );

      if (sourceMapRule) {
        // Add an exclude pattern for blazeface
        sourceMapRule.exclude = [
          /node_modules[\\\/]@tensorflow-models[\\\/]blazeface/
        ];
      }

      return webpackConfig;
    }
  }
};
