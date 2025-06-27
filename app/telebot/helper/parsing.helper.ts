import fs from 'fs';
import readline from 'readline';
import { credentialsModel } from '../../api/database/schema/credentials';

const delimiterCharacters = [':','|'];
const entityLabels = ['URL','Login','Password'];
const sampleLinesToCheck = 1000;

const debugMode = false;
const debugLinesReadCount = 100;


function cleanStringHttp(str: string){
    return str.replace('https://','https//').replace('http://','http//')
}

function fixStringHttp(str: string){
    return str.replace('https//','https://').replace('http//','http://')
}

function getDelimiterPerLine(line: string){
    let maxDelimiter = "";
    let maxDelimiterCount = 0;
    for(const delimiter of delimiterCharacters){
        const delimiterCount = (line.split(delimiter).length - 1)
        if(delimiterCount > maxDelimiterCount){
            maxDelimiter = delimiter;
            maxDelimiterCount = delimiterCount;
        }
    }
    return maxDelimiter;
}

function checkEntityType(str: string): string{
    if(str.startsWith('http'))
        return 'URL'
    if(String(str).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        return 'Login'
    return 'Password'
}

function checkLinePattern(segments: string[], delimiter: string){
    let pattern: string[] = [];
    for( const segment of segments)
    {
        const entity = checkEntityType(segment)
        if(pattern.includes(entity) && entity == 'Password')
            pattern[pattern.indexOf(entity)] = 'Login';
        pattern.push(entity)
    }
    return pattern.join(delimiter)
}

function splitStringWithExceptions(inputString: string, char: string, exceptions: number): string[][] {
    const positions: number[] = [];
    for (let i = 0; i < inputString.length; i++) {
        if (inputString[i] === char) {
            positions.push(i);
        }
    }

    function getCombinations<T>(arr: T[], k: number): T[][] {
        if (k === 0) return [[]];
        if (arr.length === 0) return [];
        
        const [first, ...rest] = arr;
        const withoutFirst = getCombinations(rest, k);
        const withFirst = getCombinations(rest, k - 1).map(comb => [first, ...comb]);
        
        return withoutFirst.concat(withFirst);
    }

    const combinationsToExclude = getCombinations(positions, exceptions);
    const results: string[][] = [];

    for (const exclude of combinationsToExclude) {
        const splitResult: string[] = [];
        let lastIndex = 0;
        
        for (let i = 0; i < inputString.length; i++) {
            if (positions.includes(i) && !exclude.includes(i)) {
                splitResult.push(inputString.substring(lastIndex, i));
                lastIndex = i + 1;
            }
        }

        splitResult.push(inputString.substring(lastIndex));
        results.push(splitResult);
    }
    return results;
}

async function getDelimiter(filepath: string){
    let delimiterCount = {};
    let delimiterMaxCount = {};
    let sample: string[] = [];
    let linesChecked = 0;

    for(const delimiter of delimiterCharacters) {
        delimiterCount[delimiter] = 0;
        delimiterMaxCount[delimiter] = 0;
    }
    await (async () => new Promise((resolve, reject) => {
        const file = readline.createInterface({
            input: fs.createReadStream(filepath),
            output: process.stdout,
            terminal: false
        });
        file.on('line', (line: string) => {
            if(linesChecked >= sampleLinesToCheck) {
                file.close();
                return;
            }
            linesChecked += 1;
            line = line.trim();
            if(line == '' || line.length == 0 || line.includes('https://t.me/'))
                return
            const checkline = cleanStringHttp(line)
            let hasDelimiter = false
            for(const delimiter of delimiterCharacters){
                if(checkline.includes(delimiter)){
                    hasDelimiter = true
                    delimiterCount[delimiter] += (checkline.split(delimiter).length - 1)
                }
            }
    
            if(hasDelimiter){
                const maxdelimiter = getDelimiterPerLine(checkline);
                delimiterMaxCount[maxdelimiter] += 1;
                sample.push(line)
            }
        });
        file.on('close', () => {
            file.removeAllListeners();
            resolve(true);
        });
        file.on('error', () => {
            reject();
        })
    }))();
    
    const mostUsedDelimiter = Object.keys(delimiterMaxCount).reduce((a, b) => delimiterMaxCount[a] > delimiterMaxCount[b] ? a : b);
    const sampleCount = sample.length
    if(sampleCount == 0){
        console.log("No delimiter is found in file")
        return null
    }
    const delimiterOccurences = delimiterCount[mostUsedDelimiter]
    const averageOccurences = Math.round(delimiterOccurences/linesChecked)
    if(averageOccurences == 0)
    {
        console.log('No delimiter is found in file')
        return null
    }
    return {
        mostUsedDelimiter,averageOccurences
    }
}

async function getPattern(filepath: string, delimiter: string, delimiterCount: number){
    let patternCount = {}
    await (async () => new Promise((resolve, reject) => {
        const file = readline.createInterface({
            input: fs.createReadStream(filepath),
            output: process.stdout,
            terminal: false
        });
        let linesChecked = 0;
        file.on('line', (line: string) => {
            if(linesChecked >= sampleLinesToCheck) {
                file.close();
                return;
            }
            linesChecked += 1;
            line = line.trim();
            if(line == '' || line.length == 0 || line.includes('https://t.me/'))
                return
            const checkline = cleanStringHttp(line)
            if((checkline.split(delimiter).length - 1) != delimiterCount){
                return
            }
            const segments = checkline.split(delimiter)
            const patternstring = checkLinePattern(segments,delimiter)
            if(!(patternstring in patternCount))
                patternCount[patternstring] = 0
            patternCount[patternstring] += 1
        });
        file.on('close', () => {
            file.removeAllListeners();
            resolve(true);
        });
        file.on('error', reject)
    }))();
    return (Object.keys(patternCount).reduce((a, b) => patternCount[a] > patternCount[b] ? a : b)).split(delimiter);
}

async function parseData(filepath: string, delimiter: string, delimiterCount: number, pattern: string[]): Promise<credentialsModel[]>{
    let debugTesting = 0;
    let dataList: credentialsModel[] = [];
    var num = 0;

    await (async () => new Promise((resolve, reject) => {
        const file = readline.createInterface({
            input: fs.createReadStream(filepath),
            output: process.stdout,
            terminal: false
        });

        file.on('line', (line: string) => {
            num += 1;
            if(num % 100000 == 0){
                console.log(`currently checking line ${num}`)
            }
            if(line == '' || line.length == 0 || line.includes('https://t.me/'))
                return
            const cleanedLine = cleanStringHttp(line.trim())
            const delimiterCheckCount = (cleanedLine.split(delimiter).length - 1)
            if(delimiterCheckCount == delimiterCount){
                const segments = cleanedLine.split(delimiter)
                let data = {}
                for (let i = 0; i < pattern.length; i++) {
                    const entity = pattern[i]
                    if(entity == "URL"){
                        data[entity] = fixStringHttp(segments[i])
                    }
                    else{
                        data[entity] = segments[i]
                    }
                }
                const dataModel: credentialsModel = {
                    url: data["URL"] ?? "",
                    login: data["Login"] ?? "",
                    password: data["Password"] ?? "",
                }
                dataList.push(dataModel)
            }
            else if(delimiterCheckCount > delimiterCount && delimiterCheckCount < 6 && line.length < 200){
                let tempDataList: credentialsModel[] = []
                const splits = splitStringWithExceptions(cleanedLine,delimiter,delimiterCheckCount-delimiterCount)
                let hasEmail = false
                for(const segments of splits){
                    let valid = true
                    let data = {}
                    for(let i=0;i<pattern.length;i++){
                        let segment = segments[i]
                        const entity = pattern[i]
                        if(entity == 'URL'){
                            segment = fixStringHttp(segment);
                        }
                        if(entity == 'Login' && String(segment).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                            hasEmail = true;
                        }
                        data[entity] = fixStringHttp(segment);
                    }
                    const dataModel: credentialsModel = {
                        url: data["URL"] ?? "",
                        login: data["Login"] ?? "",
                        password: data["Password"] ?? "",
                    }
                    if(valid){
                        tempDataList.push(dataModel)
                    }
                    if(hasEmail){
                        tempDataList = [dataModel];
                        break;
                    }
                }
                dataList = dataList.concat(tempDataList)
            }

            if(debugTesting == debugLinesReadCount && debugMode){
                file.close();
                return
            }
            debugTesting += 1;
        });
        file.on('close', () => {
            file.removeAllListeners();
            resolve(true);
        });
        file.on('error', reject)
    }))();
    return dataList
}

export async function parseFile(filepath: string){
    console.log(`Getting Delimiter`)
    const delimiter = await getDelimiter(filepath)
    console.log(`Successfully got Delimiter ${delimiter}`)
    if(delimiter == null)
        return null
    console.log(`Getting Pattern`)
    const pattern = await getPattern(filepath,delimiter.mostUsedDelimiter,delimiter.averageOccurences)
    console.log(`Successfully got Pattern ${pattern}`)
    console.log(`Parsing Data`)
    const data = await parseData(filepath,delimiter.mostUsedDelimiter, delimiter.averageOccurences, pattern)
    console.log(`Successfully got Data (${data.length} credentials)`)
    return data
}