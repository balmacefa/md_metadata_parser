"use strict";

var fs = require("fs");
var path = require("path");
const signale = require("signale");
const matchRecursive = require("./match-recursive");
const textMetadataParser = require("./text_parser/text-metadata-parser");

const Wizard = require("./caster/Wizard/index");

const filePath = path.join(__dirname, "/md_templates/01_template.md");
const formatNode = "<!-- __NODE_START__  -->...<!-- __NODE_END__  -->";
const formatMetadata = "<!-- __meta_start__...__meta_end__ -->";
const formatContent = "<!-- __content_start__ -->...<!-- __content_end__ -->";
const formatChildren =
  "<!-- __children_start__ -->...<!-- __children_end__ -->";

fs.readFile(filePath, "utf8", function(err, data) {
  if (err) {
    signale.fatal(err);
  }

  var resultTree = parseMD(data);

  console.log(JSON.stringify(resultTree, null, 4));
});

function emptyArray(array) {
  return array === undefined || array.length === 0;
}

const parseMD = data => {
  var nodes = matchRecursive(data, formatNode);

  if (emptyArray(nodes)) {
    return;
  }

  var metadataString = "";
  var meta = {};
  var castOptions = { date: ["date"], json: ["json"] };
  var wizardCaster = new Wizard(castOptions || {});
  const fn = parseMD;

  var root = [];
  nodes.forEach(node => {
    var parse = {
      metadata: getMetadata(metadataString, node, meta, wizardCaster),
      content: getContent(node)
    };

    parse.children = getChildren(node, fn);

    root.push(parse);
  });
  return root;
};

function getChildren(node, fn) {
  var childrenList = matchRecursive(node, formatChildren);

  if (emptyArray(childrenList)) {
    return;
  }

  var array = [];
  childrenList.forEach(node => {
    array.push(fn(node));
  });
  return array[0];
}

function getContent(node) {
  var content = matchRecursive(node, formatContent, true)[0].trim();
  return content;
}

function getMetadata(metadataString, node, meta, wizardCaster) {
  metadataString = matchRecursive(node, formatMetadata)[0].trim();

  meta = textMetadataParser.parse({
    caster: wizardCaster,
    text: metadataString,
    onlyMetaOutput: true
  });
  return meta;
}
