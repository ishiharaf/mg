# MusGen

This project aims to display in a visual way how musicians of the past were connected.

## Table of contents
- [General Info](#general-info)
- [How to Use](#how-to-use)
- [Setup](#setup)
- [Contributing](#contributing)
	- [Who NOT to add](#who-not-to-add)
	- [How to edit](#how-to-edit)
- [To do](#to-do)
- [Changelog](#changelog)
- [License](#license)

## General Info
After years of reading about music history, I became interested in how the musicians  were connected to each other. This is what drove me to start this side-project. I tried to keep things simple, so the data is a single JSON file served through [Express](https://expressjs.com/) and displayed using [VisJS](https://visjs.org/).

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
- **People who don't have a date of birth**. Because the position of said person on the graph is calculated using the date of birth.
- **Non-musicians**. There is a reason to include Vivaldi's father, because not only he was a musician, he was also Vivaldi's teacher. But there is no reason to include Vivaldi's mother, for example.
- **Modern-day musicians**. By modern-day musicians I mean, living and under a certain age. This is to avoid people claiming to be "*part of the* (insert musician here) *lineage*".

Exceptions are allowed, but unless said person is extremely relevant to the history of music, he/she will be rejected.

### How to edit
- Edit the `id` field.
	- It must be a sequential and unique number.
- Edit the `name` field. The `last` name field is what is displayed on the graph.
	- The spelling of the name must be the most common and well-known one. For example, `Georg Friederich Händel` should be `George Frideric Handel`. The `alt` field is where nicknames, alternate spellings and titles should go.
	- If you have a name like `Eduardo di Capua` and you're known as `Di Capua`, then the `first` name should be `Eduardo` and the `last` name should be `Di Capua`.
	- If you are known as `Capua`, then the `first` name should be `Eduardo Di` and the `last` name should be just `Capua`.
- Edit the `dateBirth` and `dateDeath` fields.
	- If the year is uncertain, add `c` (circa) before the date in the `yyyy` field.
	- If more than one year is available, pick the oldest one and add `c` before the date.
	- If the person has a `fl.` next to it and the date of birth is completely unknown, **avoid adding** said person.
	- If the month or day of birth/death is unknown, use `??` in the `mm` and `dd` fields.
- Edit the `placeBirth` and `placeDeath` fields.
	- The format is simply the `city` name, followed by a comma and the `country` name. Instead of `Romagna, Fusignano, Italy` it should be `Fusignano, Italy`.
	- The name should be whatever is the present location in English. So `Fusignano, Italy` instead of `Fusignano, Papal States`, and `Rome, Italy` instead of `Roma, Italia`.
	- If the `city` name is unknown, add just the country.
	- If the information is uncertain, add a `?` after the name.
- Edit the `relationship` field.
	- Any relationship refers to a **parent** only. This means that a person will only have his teachers as a relationship, but not his students. Depending on the relationship type, it goes from young to old.
	- `id` is the `id` number of its **parent**.
	- There are 6 types of relationship:
		- **Blood**: kins like `Brother/Sister`, `Son/Daughter`, `Nephew`, etc. The color is `red`.
		- **Love**: people who are your `Spouse`, `Lover`, `Mistress`, etc. The color is `pink`.
		- **Money**: like an `Employee`. The color is `green`.
		- `Friend`: or an `Acquaintance`. The color is `blue`.
		- `Student`: or and `Apprentice`. The color is `gray`.
		- **Unconfirmed**: it can be any of the above, but it lacks sources/proof, and it's therefore doubtful. Add an `?` after the name. The color is `black`.
- Edit the `color` field.
	- A `color` is a category and a person can be in one of the 4 categories:
		- An **important** person is someone who has contributed significantly to the art of music or his/her instrument. The color is `imp`.
		- A **musician** is anyone who is well-known for making a living by playing an instrument. People who are known solely for being a composer should not be in this category (even if they can play an instrument). The color is `mus`.
		- **Royalty** is as the name suggests, a king, queen, duke, etc. It usually implies a financial relationship, and should be added sparingly. People who are known for being musicians and are also nobles/royalty should not be in this category. The color is `roy`.
		- **Regular** people is anyone who does not fit the categories above. The color is `reg`.
- Edit the `group` field.
	- Add an occupation separated by comma.
- Edit the `sources` field.
	- This part is still under construction...
- Edit the `picture` field.
	- Add an external URL to a **portrait** picture of the person.

## To do
- Display sources on-screen.
- Test on different displays.
- Tweak the graph display options.

## Changelog
- See [CHANGELOG](CHANGELOG.MD) file.

## License
- See [LICENSE](LICENSE.MD) file.