# md_metadata_parser [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> md  YAML metada parser

## Motivation
md_metadata_parser insert [YAML](https://github.com/eemeli/yaml) metadata as Markdown comment.

You can hide metadata to the render consumer, and use the same .md file to store data for later processing - consumption.

md_metadata_parser can parse from md to json and vice versa.

# Table of contents

  * [Installation](#installation)
  * [Usage](#usage)
- [Example](#example)
- [API](#api)
  * [`parseMd2Json({'mdData', ...});`](#-parsemd2json---mddata-------)
  * [`parseJson2Md({'json', ...});`](#-parsejson2md---json-------)
- [Structure](#structure)
  * [1. Node tag](#1-node-tag)
  * [2. Metadata tag](#2-metadata-tag)
  * [3. Content tag](#3-content-tag)
  * [4. Children tag](#4-children-tag)
  * [md structure example](#md-structure-example)
  * [json (parsed from md👆) structure example](#json--parsed-from-md----structure-example)
  * [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Installation

```sh
$ npm install --save md_metadata_parser
```

## Usage

```js
const mdMetadataParser = require('md_metadata_parser');

var mdData = fs.readFileSync("md_path.md", "utf8");

// parse the md file to json object
var resultTree = mdMetadataParser.parseMd2Json({ mdData });

// parse the json object to md
var outputMD = mdMetadataParser.parseJson2Md({ rootNode: resultTree });
```

# Example

See https://github.com/balmacefa/md_metadata_parser/blob/main/test/index.test.js

# API

## `parseMd2Json({'mdData', ...});`
parse the md data to json format

| Option | Default value | Description |
| ------ | ------------- | ----------- |
| `mdData` | null | The md data to be parse |
| `startFormatNode` | ``<!-- __NODE_START__  -->`` | Open node tag
| `endFormatNode` | ``<!-- __NODE_END__  -->`` | Close node tag
| `startFormatMetadata` | ``<!-- __meta_start__`` | Open metadata tag
| `endFormatMetadata` | ``__meta_end__ -->`` | Close metadata tag
| `startFormatContent` | ``<!-- __content_start__ -->`` | Open content tag
| `endFormatContent` | ``<!-- __content_end__ -->`` | Close content tag
| `startFormatChildren` | ``<!-- __children_start__ -->`` | Open children tag
| `endFormatChildren` | ``<!-- __children_end__ -->`` | Close children tag


## `parseJson2Md({'json', ...});`
parse the md data to json format

| Option | Default value | Description |
| ------ | ------------- | ----------- |
| `json` | null | (JSON object) The json data to be parse |
| `startFormatNode` | ``<!-- __NODE_START__  -->`` | Open node tag
| `endFormatNode` | ``<!-- __NODE_END__  -->`` | Close node tag
| `startFormatMetadata` | ``<!-- __meta_start__`` | Open metadata tag
| `endFormatMetadata` | ``__meta_end__ -->`` | Close metadata tag
| `startFormatContent` | ``<!-- __content_start__ -->`` | Open content tag
| `endFormatContent` | ``<!-- __content_end__ -->`` | Close content tag
| `startFormatChildren` | ``<!-- __children_start__ -->`` | Open children tag
| `endFormatChildren` | ``<!-- __children_end__ -->`` | Close children tag


# Structure

There are 4 tags for describe the data Structure

## 1. Node tag
md: `<!-- __NODE_START__  -->`

This will be the **json object** container, all the others tags have to be inside,
> Everything outside will be ignored.

md: `<!-- __NODE_END__  -->`


## 2. Metadata tag
md: `<!-- __meta_start__`

This will be parse as [YAML](https://github.com/eemeli/yaml)
> YAML.parse( content_inside_this_tag )

json attribute: "metadata"

`__meta_end__ -->`


## 3. Content tag
md: `<!-- __content_start__ -->`

This the render md content

json attribute: "content"

md: `<!-- __content_end__ -->`
## 4. Children tag
md: `<!-- __children_start__ -->`


Array of **Node tag** ( recursive )

json attribute: "children"

md: `<!-- __children_end__ -->`

# Structure example
## md
```
<!-- __NODE_START__  -->
<!-- __meta_start__
id: 1
description: 1111
date: 2020-12-23T22:38:58.000Z

__meta_end__ -->

<!-- __content_start__ -->
# Content 1
Content 1
<!-- __content_end__ -->

<!-- __children_start__ -->

      <!-- __NODE_START__  -->
      <!-- __meta_start__
      id: 01a
      description: 1a
      
      __meta_end__ -->
      <!-- __content_start__ -->
      Content 1a
      <!-- __content_end__ -->
      
      <!-- __NODE_END__  -->

<!-- __children_end__ -->

<!-- __NODE_END__  -->


<!-- __NODE_START__  -->
<!-- __meta_start__
id: 2
description: 2222

__meta_end__ -->

<!-- __content_start__ -->
## Content 2
Content 2
<!-- __content_end__ -->

<!-- __NODE_END__  -->

```
## json
(parsed from md👆)
```
[
  {
    "metadata": {
      "id": 1,
      "description": 1111,
    },
    "content": "# Content 1\nContent 1",
    "children": [
      {
        "metadata": { "id": "01a", "description": "1a" },
        "content": "Content 1a"
      }
    ]
  },
  {
    "metadata": { "id": 2, "description": 2222 },
    "content": "## Content 2\nContent 2"
  },
]
```
## License

MIT © [balmacefa](https://github.com/balmacefa)


[npm-image]: https://badge.fury.io/js/md_metadata_parser.svg
[npm-url]: https://npmjs.org/package/md_metadata_parser
[travis-image]: https://travis-ci.com/balmacefa/md_metadata_parser.svg?branch=master
[travis-url]: https://travis-ci.com/balmacefa/md_metadata_parser
[daviddm-image]: https://david-dm.org/balmacefa/md_metadata_parser.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/balmacefa/md_metadata_parser
