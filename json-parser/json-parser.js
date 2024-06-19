#!/usr/local/bin/node

const { error } = require('console');
const fs = require('fs');
const fileName = process.argv[2];


fs.readFile(fileName,'utf8', (err, data) => {

	if (err) {
		console.error(err);
		return;
	}

	try {
       	if (isValidJSON(data)) {
        console.log('valid json file');
        process.exit(0);
    } else {
        console.log('invalid json file');
        process.exit(1);
        }
    } catch (error) {
        	console.error('invalid json file', error);
        	process.exit(1);
    }

})

function isValidJSON(data) {
	let tokens = tokenizeJSON(data)
	try {
		parseTokens(tokens)
		return true

	} catch(error) {
		return false
	}
}

function tokenizeJSON(json) {
    const tokens = [];
    let currentToken = '';
    let inString = false;

    for (const char of json) {
        if (char === '\n' || char === ' ' || char === '\t') {
            continue;
        }

        if (char === '"') {
            if (inString) {
                tokens.push(currentToken + '"');
                currentToken = '';
            } else {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                currentToken = '"';
            }
            inString = !inString;
            continue;
        }

        if (inString) {
            currentToken += char;
            continue;
        }

        if ('{}[]:,' .includes(char)) {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = '';
            }
            tokens.push(char);
        } else {
            currentToken += char;
        }
    }

    if (currentToken) {
        tokens.push(currentToken);
    }


    return tokens;

}

function parseTokens(tokens) {
	stack = []

	for (let i = 0; i < tokens.length; i++) {
		word = tokens[i]
		console.log(word)
		if (word === '{' || word === '[' || word === '(') {
			stack.push(word)
		} else if (word === '}' || word === ']' || word === ')') {
			let lastValue = stack.pop()
			if ((lastValue === '{' && word !== '}') || (lastValue === '[' && word !== ']') || (lastValue === '(' && word !== ')')) {
				throw new Error ('Invalid JSON structure')
			} 
			if (word === '}' && tokens[tokens.length - 2] === ',') {
				throw new Error ('Invalid JSON structure')
			} 
                }
		else if (word === ',' || word === ':' || word.startsWith('"')){
		         continue;
		}

		else {
			if (!validateNumberBooleanNull(word)) throw new Error ('Invalid JSON structure')
		}

	}
	if (stack.length !== 0) throw new Error ('Missing closing paranthesis')
}

function validateNumberBooleanNull(word) {
	return ['true', 'false', 'null'].includes(word) || word.startsWith('"') || !isNaN(word)
}

