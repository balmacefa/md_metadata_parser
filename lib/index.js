"use strict";

var fs = require("fs");
var path = require("path");
const signale = require("signale");
const matchRecursive = require("./match-recursive");
const textMetadataParser = require("./text_parser/text-metadata-parser");

const Wizard = require("./caster/Wizard/index");

const filePath = path.join(__dirname, "/md_templates/02_template.md");

const startFormatNode = "<!-- __NODE_START__  -->";
const endFormatNode = "<!-- __NODE_END__  -->";
const formatNode = startFormatNode + "..." + endFormatNode;

const startFormatMetadata = "<!-- __meta_start__";
const endFormatMetadata = "__meta_end__ -->";
const formatMetadata = startFormatMetadata + "..." + endFormatMetadata;

const startFormatContent = "<!-- __content_start__ -->";
const endFormatContent = "<!-- __content_end__ -->";
const formatContent = startFormatContent + "..." + endFormatContent;

const startFormatChildren = "<!-- __children_start__ -->";
const endFormatChildren = "<!-- __children_end__ -->";
const formatChildren = startFormatChildren + "..." + endFormatChildren;

const enter = "\n";

fs.readFile(filePath, "utf8", function(err, data) {
  if (err) {
    signale.fatal(err);
  }

  var resultTree = parseMd2Json(data);

  console.log(JSON.stringify(resultTree, null, 4));
  var outputMD = parseJson2Md(resultTree);
  console.log(outputMD);
});

const emptyArray = array => {
  return array === undefined || array.length === 0;
};

const nameBlock = (start, end, data) => {
  return `${start}${enter}${data}${enter}${end}${enter}`;
};

const json2Metadata = metadata => {
  var output = "";

  // eslint-disable-next-line guard-for-in
  for (const key in metadata) {
    output += `${key}: ${JSON.stringify(metadata[key])}${enter}`;
  }

  return nameBlock(startFormatMetadata, endFormatMetadata, output);
};

const json2Content = content => {
  return nameBlock(startFormatContent, endFormatContent, content);
};

const json2children = children => {
  if (emptyArray(children)) {
    return "";
  }

  var output = "";
  // eslint-disable-next-line guard-for-in
  for (var node in children) {
    output += json2Node(children[node]);
  }

  return nameBlock(startFormatChildren, endFormatChildren, output);
};

const json2Node = data => {
  var output = "";
  output += json2Metadata(data.metadata);
  output += json2Content(data.content);
  output += json2children(data.children);
  return nameBlock(startFormatNode, endFormatNode, output);
};

const parseJson2Md = data => {
  var output = "";
  data.forEach(node => {
    output = json2Node(node);
  });
  return output;
};

const parseMd2Json = data => {
  var nodes = matchRecursive(data, formatNode);

  if (emptyArray(nodes)) {
    return;
  }

  var metadataString = "";
  var meta = {};
  var castOptions = { date: ["date"], json: ["json"] };
  var wizardCaster = new Wizard(castOptions || {});

  var root = [];
  nodes.forEach(node => {
    var parse = {
      metadata: getMetadata(metadataString, node, meta, wizardCaster),
      content: getContent(node)
    };

    parse.children = getChildren(node, parseMd2Json);

    root.push(parse);
  });
  return root;
};

const getChildren = node => {
  var childrenList = matchRecursive(node, formatChildren);

  if (emptyArray(childrenList)) {
    return;
  }

  var array = [];
  childrenList.forEach(node => {
    array.push(parseMd2Json(node));
  });
  return array[0];
};

const getContent = node => {
  var content = matchRecursive(node, formatContent, true)[0].trim();
  return content;
};

const getMetadata = (metadataString, node, meta, wizardCaster) => {
  metadataString = matchRecursive(node, formatMetadata)[0].trim();

  meta = textMetadataParser.parse({
    caster: wizardCaster,
    text: metadataString,
    onlyMetaOutput: true
  });
  return meta;
};
