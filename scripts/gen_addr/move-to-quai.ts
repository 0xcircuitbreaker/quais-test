import * as fs from 'fs';
import { typeFlag } from 'type-flag'

const inputFilePath = 'network.txt'; // Path to your input file with the new values


const parsed = typeFlag({
    dir: {
        type: String,
        default: "/Users/root/go-quai/network.env",
        alias: "d"
    }
})

function readAndReplace() {
  const networkEnvPath = parsed.flags.dir;
  const networkEnvContents = fs.readFileSync(networkEnvPath, 'utf-8');
  const inputContents = fs.readFileSync(inputFilePath, 'utf-8');

  const inputMap = new Map<string, string>();
  const inputLines = inputContents.split('\n');
  inputLines.forEach((line) => {
    const [key, value] = line.split('=');
    inputMap.set(key, value);
  });

  const networkEnvLines = networkEnvContents.split('\n');
  const newContents = networkEnvLines.map((line) => {
    const [key] = line.split('=');

    if (inputMap.has(key) && inputMap.get(key) !== undefined) {
      return `${key}=${inputMap.get(key)}`;
    }
    return line;
  });

  fs.writeFileSync(networkEnvPath, newContents.join('\n'), 'utf-8');
}

readAndReplace();