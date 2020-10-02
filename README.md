# mg

This project aims to display in a visual way how musicians of the past were connected to each other. **mg** doesn't stand for anything in particular.

## Table of contents
- [General Info](#general-info)
- [How to Use](#how-to-use)
- [Setup](#setup)
- [Contributing](#contributing)
	- [Who NOT to add](#who-not-to-add)
- [To do](#to-do)
- [Changelog](#changelog)
- [License](#license)

## General Info
After years of reading about music history, I became interested in how musicians  were connected, and wanted to see this connection as a network graph, or a genealogical tree. This is what drove me to start this side-project. I tried to keep things simple, so the data is a single JSON file served through [Express](https://expressjs.com/) and displayed using [VisJS](https://visjs.org/).

## How to Use
- Use the mouse wheel to **zoom in & out**.
- Click in an empty spot and hold to **drag the graph** around.
- Click on a box to **display information** about a person.
- Click on a box and hold to **drag it** horizontally.
- Click the `?` button to display a legend.

## Setup
To run this project, clone the repository and install it locally using npm:

```bash
$ npm install
$ node app.js
```

You can  modify `package.json` to run with `npm start` by removing the `nodemon` part.

Also, you can change the layout to a random generated one by editing this part of `main.js` and changing `enabled: true` to `false`:

```javascript
hierarchical: {
	enabled: true,
	direction: "UD",
	levelSeparation: 10,
	sortMethod: "hubsize"
	// shakeTowards: "leaves"
}
```

## Contributing
You can contribute by adding more musicians to `people.json`, reviewing existing data to verify its correctness and consistency, or by adding sources and missing information. Suggestions are also welcome. You can do this by creating a pull request or by filing an issue.

### Who NOT to add
- **People with an unknown date of birth**. Because the position of someone on the graph is calculated using the date of birth, it's impossible to add them while keeping a hierarchical layout.
- **Non-musicians**. There is a reason to include Vivaldi's father, because not only he was a musician, he was also his teacher. But there is no reason to include his mother, for example.
- **Contemporary musicians**. By contemporary musicians I mean, living musicians. This is to avoid people claiming to be "*part of the* (insert musician here) *lineage*".

Exceptions are allowed, but unless said person is extremely relevant to the history of music, he/she will be rejected. Patrons of music are usually allowed.

To see detailed instructions on how to edit see the [CONTRIBUTING](CONTRIBUTING.md) file.

## To do
- Test on different displays.
- Tweak the graph display options.

## Changelog
- See [CHANGELOG](CHANGELOG.md) file.

## License
- See [LICENSE](LICENSE.md) file.