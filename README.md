# mg

This project aims to display in a visual way how musicians of the past were connected to each other. **mg** doesn't stand for anything in particular.

## Table of contents
- [General Info](#general-info)
- [How to Use](#how-to-use)
- [Setup](#setup)
- [Contributing](#contributing)
- [To do](#to-do)
- [Changelog](#changelog)
- [License](#license)

## General Info
After years of reading about music history, I became interested in how musicians  were connected, and wanted to see this connection as a network graph, or a genealogical tree. This is what drove me to start this side-project. I tried to keep things simple, so the data is a single JSON file served through [Express](https://expressjs.com/) and displayed using [VisJS](https://visjs.org/).

## How to Use
- Use the mouse wheel to **zoom in & out**.
- Click in an empty spot and hold to **drag the graph** around.
- Click on a box and hold to **drag it** horizontally.
- Click on a box to **display information** about a person.
- Click in an empty spot to clear the selection.
- Click the `?` button to display a legend and basic operation.
- Click the `gear` icon to display the configuration menu. For more details about each option check the links below.
	- For arrow type, force direction and roundness, check VisJS' [example](https://visjs.github.io/vis-network/examples/network/edgeStyles/smooth.html).
	- Hierarchical layout:
		- Level separation is the vertical distance between the different nodes.
		- Tree spacing is the distance between different trees (independent networks).
		- For the direction of the layout, check VisJS' [example](https://visjs.github.io/vis-network/examples/network/layout/hierarchicalLayoutUserdefined.html).
	- Random layout:
		- When using the random layout, the nodes are randomly positioned. The result is different every time, but if you provide a seed manually, you can reuse the same layout again.
- Click the `loupe` icon to do a basic search. Matches will be highlighted on the graph.
	- You can use `c` before the year to search within a 20 year range. e.g.: `c1650` will match anything between 1640 and 1660.
	- You can use `-` or `~` to search within a bigger range. e.g.: `1500-1600` will match anything between 1500 and 1600.

## Setup
To run this project, clone the repository and install it locally using npm:

```bash
$ npm install
$ npm start
```

By default it runs on `localhost:8000`.

## Contributing
You can contribute by adding more musicians to `people.json`, reviewing existing data to verify its correctness and consistency, or by adding sources and missing information. Suggestions are also welcome. You can do this by creating a pull request or by filing an issue.

To see detailed instructions on how to edit see the [CONTRIBUTING](CONTRIBUTING.md) file.

## To do
- Test on different displays.

## Changelog
- See [CHANGELOG](CHANGELOG.md) file.

## License
- See [LICENSE](LICENSE.md) file.