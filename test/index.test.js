"use strict";

var fs = require("fs");
var path = require("path");
var mdMetadataParser = require("../lib");

const filePath = path.join(__dirname, "/md_templates/01_template.md");

const startFormatNode = "<!-- __NODE_START__  -->";
const endFormatNode = "<!-- __NODE_END__  -->";

const startFormatMetadata = "<!-- __meta_start__";
const endFormatMetadata = "__meta_end__ -->";

const startFormatContent = "<!-- __content_start__ -->";
const endFormatContent = "<!-- __content_end__ -->";

const startFormatChildren = "<!-- __children_start__ -->";
const endFormatChildren = "<!-- __children_end__ -->";

fs.readFile("build.md", "utf8", function(err, data) {
  if (err) {
    console.error(err);
  }

  var resultTree = mdMetadataParser.parseMd2Json({ mdData: data });

  // Console.log(JSON.stringify(resultTree, null, 4));
  var outputMD = mdMetadataParser.parseJson2Md({ rootNode: resultTree });
  console.log(outputMD);
  // Fs.writeFile("build.md", outputMD, "utf8", function(err, data) {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
});
