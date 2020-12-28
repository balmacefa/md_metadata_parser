"use strict";

const matchRecursive = require("./match-recursive");
const textMetadataParser = require("./text_parser/text-metadata-parser");

const Wizard = require("./caster/Wizard/index");
const enter = "\n";

const emptyArray = array => {
  return array === undefined || array.length === 0;
};

module.exports.parseMd2Json = function({
  mdData,
  startFormatNode = "<!-- __NODE_START__  -->",
  endFormatNode = "<!-- __NODE_END__  -->",
  startFormatMetadata = "<!-- __meta_start__",
  endFormatMetadata = "__meta_end__ -->",
  startFormatContent = "<!-- __content_start__ -->",
  endFormatContent = "<!-- __content_end__ -->",
  startFormatChildren = "<!-- __children_start__ -->",
  endFormatChildren = "<!-- __children_end__ -->"
}) {
  const formatNode = startFormatNode + "..." + endFormatNode;
  const formatMetadata = startFormatMetadata + "..." + endFormatMetadata;
  const formatContent = startFormatContent + "..." + endFormatContent;
  const formatChildren = startFormatChildren + "..." + endFormatChildren;

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

  return parseMd2Json(mdData);
};

module.exports.parseJson2Md = function({
  rootNode,
  startFormatNode = "<!-- __NODE_START__  -->",
  endFormatNode = "<!-- __NODE_END__  -->",
  startFormatMetadata = "<!-- __meta_start__",
  endFormatMetadata = "__meta_end__ -->",
  startFormatContent = "<!-- __content_start__ -->",
  endFormatContent = "<!-- __content_end__ -->",
  startFormatChildren = "<!-- __children_start__ -->",
  endFormatChildren = "<!-- __children_end__ -->"
}) {
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
      output += json2Node(node);
    });
    return output;
  };

  return parseJson2Md(rootNode);
};
