module.exports = {
	tasks: {
		bump: {
			watch: [
				"package.json",
				"bower.json"
			]
		},
		"dist": {
			"watch": [ "src/**/*.js" ],
			"build": [ "src/**/*.js", "!src/include/**/*.js" ],
			"dest": "dist/"
		}
	},
	settings: {},
	strings: {
		banner: {
			min: [
				"/**! {{gulp:package.title}} {{gulp:package.version}} {{gulp:package.license}} | {{gulp:package.homepage}} | (c) {{gulp:date.year}} {{gulp:package.author.name}} */",
				""
			].join('\n'),
			max: [
				"/**!",
				" * {{gulp:package.title}}",
				" *",
				" * version: {{gulp:package.version}}",
				" * module:  {{gulp:module}}",
				" * date:    {{gulp:date.year}}-{{gulp:date.month}}-{{gulp:date.day}}",
				" * author:  {{gulp:package.author.name}} <{{gulp:package.author.email}}>",
				" * website: {{gulp:package.homepage}}",
				" * license: {{gulp:package.license}}",
				" *",
				" * Copyright (c) {{gulp:date.year}} {{gulp:package.author.name}}",
				" */",
				""
			].join('\n')
		}
	}
};