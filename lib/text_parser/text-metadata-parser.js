const YAML = require("yaml");

exports.parse = function(text) {
  if (text.indexOf("---") !== 0) {
    text = "---\n" + text;
  }

  return YAML.parse(text);
};
