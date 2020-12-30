/* eslint-disable no-unused-vars */
"use strict";

var fs = require("fs");
var path = require("path");
var mdMetadataParser = require("../lib");

const mdStandardFilePath = path.join(__dirname, "/templates/01_template.md");
const jsonStandardFilePath = path.join(
  __dirname,
  "/templates/01_template.json"
);

const mdCustomFilePath = path.join(__dirname, "/templates/02_template.md");
const jsonCustomFilePath = path.join(__dirname, "/templates/02_template.json");

const startFormatNode = "<!-- __NODE_BEGIN__  -->";
const endFormatNode = "<!-- __NODE_END__  -->";

const startFormatMetadata = "<!-- __info_start__";
const endFormatMetadata = "__info_end__ -->";

const startFormatContent = "<!-- __render_start__ -->";
const endFormatContent = "<!-- __render_end__ -->";

const startFormatChildren = "<!-- __nodes_start__ -->";
const endFormatChildren = "<!-- __nodes_end__ -->";

describe("Standard MD parser e2e", () => {
  test("parse Md to Json", () => {
    var mdData = fs.readFileSync(mdStandardFilePath, "utf8");
    var jsonData = fs.readFileSync(jsonStandardFilePath, "utf8");

    var resultTree = mdMetadataParser.parseMd2Json({ mdData });
    expect(resultTree).toEqual(JSON.parse(jsonData));
  });
  test("parse Json to MD", () => {
    var mdData = fs.readFileSync(mdStandardFilePath, "utf8");
    var resultTree = mdMetadataParser.parseMd2Json({ mdData });
    var outputMD = mdMetadataParser.parseJson2Md({ rootNode: resultTree });
    expect(outputMD).toBe(mdData);
  });
});

describe("Custom MD parser e2e", () => {
  test("parse Md to Json", () => {
    var mdData = fs.readFileSync(mdCustomFilePath, "utf8");
    var jsonData = fs.readFileSync(jsonCustomFilePath, "utf8");

    var resultTree = mdMetadataParser.parseMd2Json({
      mdData,
      startFormatNode,
      endFormatNode,
      startFormatMetadata,
      endFormatMetadata,
      startFormatContent,
      endFormatContent,
      startFormatChildren,
      endFormatChildren
    });
    expect(resultTree).toEqual(JSON.parse(jsonData));
  });
  test("parse Json to MD", () => {
    var mdData = fs.readFileSync(mdCustomFilePath, "utf8");
    var resultTree = mdMetadataParser.parseMd2Json({
      mdData,
      startFormatNode,
      endFormatNode,
      startFormatMetadata,
      endFormatMetadata,
      startFormatContent,
      endFormatContent,
      startFormatChildren,
      endFormatChildren
    });
    var outputMD = mdMetadataParser.parseJson2Md({
      rootNode: resultTree,
      startFormatNode,
      endFormatNode,
      startFormatMetadata,
      endFormatMetadata,
      startFormatContent,
      endFormatContent,
      startFormatChildren,
      endFormatChildren
    });
    expect(outputMD).toBe(mdData);
  });
});
