# Contributing

## Table of contents
- [DON'T add](#dont-add)
- [The schema](#the-schema)
- [How to add](#how-to-add)

## DON'T add
- **People with an unknown date of birth**. Because the position of a person on the graph (their level) is calculated using the date of birth, it's impossible to add them while keeping a hierarchical layout.
- **Non-musicians**. There is a reason to include Vivaldi's father, because not only he was a musician, he was also his teacher. But there is no reason to include his mother, for example. Some exceptions, like patrons of music are usually allowed.
- **Contemporary musicians**. By contemporary musicians I mean, living musicians. This is to avoid people claiming to be "*part of the* (insert musician here) *lineage*". Unless said person is extremely important to the history of music, he/she will be rejected.

## The schema

First, let's take a look at the schema. You can use the `schema.json` file inside the data folder for now.

```json
{
	"id": "",
	"name": {
		"first": "",
		"last": "",
		"alt": [""]
	},
	"dateBirth": {
		"yyyy": "",
		"mm": "",
		"dd": ""
	},
	"dateDeath": {
		"yyyy": "",
		"mm": "",
		"dd": ""
	},
	"placeBirth": "",
	"placeDeath": "",
	"relationship": [{
		"id": "",
		"type": "",
		"color": ""
	}],
	"color": "",
	"group": [""],
	"source": [{
		"citation": "",
		"extract": ""
	}],
	"picture": ""
}
```

### ID
It must be a sequential and unique **number**. When adding someone new, leave it as `""` or `0`.

```json
{"id": "16"} is invalid
{"id": 16} is valid
```

### Name
The `last` name field is what is displayed on the graph. The `alt` field is where nicknames and alternate spellings should go. It should have each name enclosed by quotation marks and followed by a comma.

```json
{"alt": ["Friedrich der Große, Der Alte Fritz"]} is invalid
{"alt": ["Friedrich der Große", "Der Alte Fritz"]} is valid
```

The spelling of the name must be the most common and well-known one. For example, `Georg Friederich Händel` should be `George Frideric Handel`. If there are multiple ways to spell a name, put them all inside the `alt` field as follows.

```json
{"alt": ["François d'Agincour/Dagincourt/Dagincour"]}
```

If you have a name like `Eduardo di Capua` and you're known as `Di Capua`, then the `first` name should be `Eduardo` and the `last` name should be `di Capua`. If you are known as `Capua`, then the `first` name should be `Eduardo di` and the `last` name should be just `Capua`.

### Date of Birth/Death
If the year is uncertain, add `c` (circa) before the date in the `yyyy` field. If more than one year is available, pick the oldest one and add `c` before the date.

```json
{"year": "178?"} or anything including a "?" is invalid
{"year": "1780/1"} or anything similar is invalid
{"year": "c1780"} is valid
```

If the person has a `fl.` next to it and the date of birth is completely unknown, **don't add** said person.

If the month or day of birth/death is unknown, use `??` in the `mm` and `dd` fields. The same rules for `yyyy` still apply.

```json
{"mm": "05", "dd": "2?"} or {"mm": "05", "dd": "23/4"} and anything similar is invalid
{"mm": "05", "dd": "??"} or {"mm": "??", "dd": "23"} is valid
{"mm": "??", "dd": "??"} is also valid
```

### Place of Birth/Death

The format is simply the `city` name, followed by a comma and the `country` name. Instead of `Romagna, Fusignano, Italy` it should be `Fusignano, Italy`. Do not include the state, prefecture, etc. It should also be in English. So `Rome, Italy` instead of `Roma, Italia`.

Because a lot of places kept changing during history, add whatever is the most accepted location. For example, Corelli was born in the `Papal States`, but most people will just say `Italy` instead.

If the `city` name is unknown, add just the country. If the information is uncertain, add a `(?)` after the end.

### Relationships

Any relationship refers to a **parent** only. This means that a person will only have his teachers as a relationship, but not his students. Depending on the relationship type, it goes from young to old. The`id` is the `id` number of its **parent**.

There are 6 types of relationship:
- A **blood** relationship like `Brother/Sister`, `Son/Daughter`, `Nephew`, etc. The color is `red`.
- A **carnal** relationship like `Spouse`, `Lover`, `Mistress`, etc. The color is `pink`.
- A **financial** relationship like an `Employee` or `Patronee`. The color is `green`.
- A kind of **friendship**, like `Friend` or `Acquaintance`. The color is `blue` for `Acquaintance` and `lightBlue` for `Friend`.
- A **master/student** relationship, like `Student` or an `Apprentice`. The color is `gray`.
- An **unconfirmed** relationship: it can be any of the above, but it lacks sources/proof, and it's therefore doubtful. Add a source stating that it's doubtful, or an `(?)` after the type. The color is `black`.

### Color

A `color` is a category and a person can be in one of the 4 categories:

- A **musician** is anyone who is well-known for making a living by playing an instrument. The color is `blue`. People who are known solely for being a composer (even if they can play an instrument) have the `darkBlue` color.
- An **important** person is someone who has contributed significantly to the art of music or his/her instrument. The color is `red`. Composers are `darkRed`.
- A **royalty** is as the name suggests, a king, queen, duke, or any kind of nobility. It usually implies a financial relationship, and should be added sparingly. Also applies to people who are patrons. The color is `darkGreen`. People who are known for being musicians and are also nobles/royalty have the `green` color.
- **Regular** people is anyone who does not fit the categories above. The color is `gray`.

### Group

Add an occupation separated by comma. The same rules for the `alt` field applies here.

### Sources

Add a number enclosed in square brackets where the source is referring to. Like `Arcangelo Corelli [n]` to add a source to Corelli's name. Then add said source to the `source` field. The number `[n]` must be equivalent to the index in `source`. Add `[n]` to the last field in case multiple fields are available, or at the end in case of a single field.

```json
{
	"name": {
		"first": "Antonio",
		"last": "Vivaldi",
		"alt": ["Antonio Lucio Vivaldi", "Il Prete Rosso [1]"]
	},
	"placeBirth": "Venice, Italy [2]",
	"source": [{
		"citation": "Marc Pincherle, Vivaldi: Genius of the Baroque (Paris: W. W. Norton & Company, Inc., 1957), 16",
		"extract": ""
	},{
		"citation": "https://www.britannica.com/EBchecked/topic/631387",
		"extract": "Michael Talbot and the Editors of the Encyclopædia Britannica, Antonio Vivaldi"
	}]
}
```

### Picture

Add an external URL to a **portrait** picture of the person.

## How to add

Now that you understand the schema, you can add a person by editing `person.json` and making a pull request. If there's data inside this file, you can copy and paste an empty schema from the `schema.json` file. You can also add someone by opening a new issue with the label `add` and pasting a filled schema inside.