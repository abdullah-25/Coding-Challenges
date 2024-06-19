#!/usr/local/bin/node

const fs = require('fs');
let fileName;
const commandLineoption = process.argv[2];

//  if no standard input is given, meaning the input is coming from a different source (getting piped with cat command)
if (!process.stdin.isTTY){
        let data = '';

        //by default, node interprets input as binary, encoding it to UTF8 since some characters could be multi-byte
        process.stdin.setEncoding('utf8');

        // source: https://blog.logrocket.com/using-stdout-stdin-stderr-node-js/
        process.stdin.on("data", chunk => {
                data += chunk;
        })

        process.stdin.on("end", ()  => {

         // this process is async so its crucial to call the processFile function directly from here
        const {charactersCount, wordsCount, numberOfLines, fileSizeInBytes} = parseFile(data);
	fileName = 'test.txt'
        displayResult(charactersCount, wordsCount, numberOfLines,fileName)
        });

} else {
        // if no command is given
        if (process.argv.length < 4){
                fileName = process.argv[2];
                readFileContent(fileName);
        } else {
                fileName = process.argv[3];
		readFileContent(fileName);
        }
}

function readFileContent(fileName){
       
       	const stats = fs.existsSync(fileName);

        if (!stats) {
             console.log(`File not found: ${fileName}`);
            process.exit(1);
        }
        //https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_readfilesync_file_options
        fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) throw err;
                const {charactersCount, wordsCount, numberOfLines, fileSizeInBytes} =  parseFile(data);
                displayResult(charactersCount, wordsCount, numberOfLines, fileSizeInBytes);
        });

}


        


function parseFile(data){
        const charactersCount = data.length;
        const wordsCount = data.split(' ').length
        const numberOfLines = data.split('\n').length;
	const fileSizeInBytes = Buffer.byteLength(data, 'utf8');       
 	return {charactersCount, wordsCount, numberOfLines, fileSizeInBytes};
}

function displayResult(charactersCount, wordsCount, numberOfLines){

        if (commandLineoption === '-l') {
                console.log(`${numberOfLines} ${fileName}`);
        } else if (commandLineoption === '-w') {
                console.log(`${wordsCount} ${fileName}`);
        } else if (commandLineoption === '-m') {
                console.log(`${charactersCount} ${fileName}`);
        } else if (commandLineoption === '-c'){
                console.log(`${fileSizeInBytes} ${fileName}`);
                
        } else {
                console.log(`${numberOfLines} ${wordsCount} ${charactersCount} ${fileName}`);
        }
        
}



		








