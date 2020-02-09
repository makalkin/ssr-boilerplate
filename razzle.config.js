const path = require("path");

module.exports = {
  plugins: [
    "scss"
  ],
  modify: (config, { target, dev }, webpack) => {
    /*
      this is a hack that enables css-modules for .scss files
    */
    for (const rule of config.module.rules) {
      // Add loader for .module.scss files
      if (rule.test && rule.test.toString() === "/\\.module\\.css$/") {
        const scss = { ...rule };
        scss.test = /\.module\.scss$/;
        scss.include = path.join(__dirname, "src");
        scss.use.push({ loader: "sass-loader" });
        config.module.rules.push(scss);
      }
      // Exlude .module.scss from 'sass' rule
      if (rule.test && rule.test.toString() === "/\\.(sa|sc)ss$/") {
        rule.exclude = [/\.module\.scss$/];
      }
    }

    return config;
  }
}

