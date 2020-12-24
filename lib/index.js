"use strict";

var fs = require("fs");
var path = require("path");
const signale = require("signale");
var matchRecursive = require("match-recursive");
var textMetadataParser = require("./text_parser/text-metadata-parser");

var Wizard = require("weak-type-caster");

var filePath = path.join(__dirname, "/md_templates/01_template.md");
var formatNode = "<__NODE__>...</__NODE__>";
var formatMetadata = "<--...-->";

function parseJson(input) {
  try {
    signale.log("parseJson");
    return JSON.parse(input);
  } catch (error) {
    signale.fatal(error);
    return input;
  }
}

fs.readFile(filePath, "utf8", function(err, data) {
  if (err) {
    signale.fatal(err);
  }

  var result = matchRecursive(data, formatNode);
  var metadata = "";

  var castOptions = { date: ["date"] };
  var wizardCaster = new Wizard(castOptions || {});

  castOptions = {
    cast: {
      exciting: wizardCaster.getLevelUpEncoding().decode
    }
  };

  result.forEach(node => {
    metadata = matchRecursive(node, formatMetadata)[0].trim();

    textMetadataParser.parse({
      caster: wizardCaster,
      text: metadata,
      onlyMetaOutput: true
    });

    // Signale.debug("[metadata]", metadata);
    console.dir(metadata);
  });

  // Signale.success(result);
});

module.exports = {};
