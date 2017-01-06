var path                    = require('path'),
	util                    = require('gulp-util'),
	config                  = require('./config'),
	objectPrototypeToString = Object.prototype.toString,
	base                    = path.normalize(__dirname + '/../src'),
	regexMatchBase          = new RegExp('^' + base),
	regexDateYear           = new RegExp('{{gulp:date.year}}', 'g'),
	regexDateMonth          = new RegExp('{{gulp:date.month}}', 'g'),
	regexDateDay            = new RegExp('{{gulp:date.day}}', 'g'),
	regexDateTime           = new RegExp('{{gulp:date.time}}', 'g'),
	rights                  = {
		owner: {
			read: true,
			write: true,
			execute: false
		},
		group: {
			read: true,
			write: false,
			execute: false
		},
		others: {
			read: true,
			write: false,
			execute: false
		}
	},
	package, pattern;

function handleError(error) {
	util.log(error);
}

function getPackage() {
	delete require.cache[require.resolve('../package.json')];

	return require('../package.json');
}

function getConfig() {
	delete require.cache[require.resolve('./config')];

	return replacePattern(require('./config'));
}

function transform(content, file) {
	var result   = content,
		relative = file.path.replace(regexMatchBase, ''),
		i = 0, item;

	for(; item = pattern[i]; i++) {
		result = result.replace(item.pattern, item.replacement);
	}

	result = result.replace('{{gulp:file:path}}', relative);
	result = result.replace('{{gulp:file:name}}', path.basename(file.path));
	result = result.replace('{{gulp:module}}', relative.replace(new RegExp(path.extname(file.path) + '$'), ''));

	return result;
}

function preparePattern(node, prefix) {
	var result = node ? [] : getDatePattern(),
		key, id, item;

	node = node || package;

	for(key in node) {
		id   = (prefix) ? prefix + '.' + key : 'package.' + key;
		item = node[key];

		if(typeof item === 'string') {
			result.push({ pattern: new RegExp('{{gulp:' + id + '}}', 'g'), replacement: item });
		} else if(objectPrototypeToString.call(item) === '[object Object]') {
			result = result.concat(preparePattern(item, id));
		}
	}

	return result;
}

function replacePattern(value) {
	var i = 0, entry;

	value = JSON.stringify(value);

	for(; (entry = patterns[i]) !== undefined; i++) {
		value = value.replace(entry.pattern, entry.replacement);
	}

	return JSON.parse(value);
}

function getDatePattern() {
	var date  = new Date(),
		month = ''.concat('0', (date.getMonth() + 1).toString()).slice(-2),
		day   = ''.concat('0', date.getDate().toString()).slice(-2),
		time  = ''.concat('0', date.getHours().toString()).slice(-2) + ':' + ''.concat('0', date.getMinutes().toString()).slice(-2) + ':' + ''.concat('0', date.getSeconds().toString()).slice(-2);

	return [
		{ pattern: regexDateYear,  replacement: date.getFullYear() },
		{ pattern: regexDateMonth, replacement: month },
		{ pattern: regexDateDay,   replacement: day },
		{ pattern: regexDateTime,  replacement: time }
	];
}

package = getPackage();
pattern = preparePattern();

module.exports = {
	handleError: handleError,
	getPackage:  getPackage,
	getConfig:   getConfig,
	transform:   transform
};