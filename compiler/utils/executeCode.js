const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

const codesDir = path.join(__dirname, "..", "codes");
const outputsDir = path.join(__dirname, "..", "outputs");

if (!fs.existsSync(codesDir)) fs.mkdirSync(codesDir);
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir);

const executeCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    let filename, filepath;

    // save code to file
    if (language === "cpp") {
      filename = `${jobId}.cpp`;
      filepath = path.join(codesDir, filename);
      fs.writeFileSync(filepath, code);

      const inputFilePath = path.join(outputsDir, `${jobId}_input.txt`);
      fs.writeFileSync(inputFilePath, input);

      const outputFile = path.join(outputsDir, `${jobId}.exe`);
      const compileCmd = `g++ "${filepath}" -o "${outputFile}"`;

      const cleanup = () => {
        try {
          fs.unlinkSync(filepath);         // .cpp
          fs.unlinkSync(inputFilePath);    // .txt
          fs.unlinkSync(outputFile);       // .exe
        } catch (e) {
          console.warn("Cleanup failed:", e.message);
        }
      };

      //compile
      exec(compileCmd, (compileErr, _, compileStdErr) => {
        if (compileErr || compileStdErr) {
          cleanup();
          return reject(new Error(compileStdErr || compileErr.message));
        }

        const runCmd = `"${outputFile}" < "${inputFilePath}"`;
        exec(runCmd, (runErr, stdout, stderr) => {
          cleanup();
          if (runErr || stderr) {
            return reject(new Error(stderr || runErr.message));
          }
          return resolve(stdout);
        });
      });
    }

    else if (language === "python") {
      filename = `${jobId}.py`;
      filepath = path.join(codesDir, filename);
      fs.writeFileSync(filepath, code);

      const inputFilePath = path.join(outputsDir, `${jobId}_input.txt`);
      fs.writeFileSync(inputFilePath, input);

      const runCmd = `python "${filepath}" < "${inputFilePath}"`;

      const cleanup = () => {
        try {
          fs.unlinkSync(filepath); // .py
          fs.unlinkSync(inputFilePath); // input
        } catch (e) {
          console.warn("Cleanup failed (Python):", e.message);
        }
      };

      exec(runCmd, (err, stdout, stderr) => {
        cleanup();
        if (err || stderr) {
          return reject(new Error(stderr || err.message));
        }
        return resolve(stdout);
      });
    }

    else if (language === "java") {
      filename = `${jobId}.java`;
      filepath = path.join(codesDir, filename);
      fs.writeFileSync(filepath, code);

      const inputFilePath = path.join(outputsDir, `${jobId}_input.txt`);
      fs.writeFileSync(inputFilePath, input);

      const compileCmd = `javac "${filepath}"`;
      const classFile = path.join(codesDir, `${jobId}.class`);
      const runCmd = `java -cp "${codesDir}" ${jobId} < "${inputFilePath}"`;

      const cleanup = () => {
        try {
          fs.unlinkSync(filepath);       // .java
          fs.unlinkSync(inputFilePath);  // input.txt
          fs.unlinkSync(classFile);      // compiled .class
        } catch (e) {
          console.warn("Cleanup failed (Java):", e.message);
        }
      };
 
      exec(compileCmd, (compileErr, _, compileStderr) => {
        if (compileErr || compileStderr) {
          cleanup();
          return reject(new Error(compileStderr || compileErr.message));
        }

        exec(runCmd, (runErr, stdout, stderr) => {
          cleanup();
          if (runErr || stderr) {
            return reject(new Error(stderr || runErr.message));
          }
          return resolve(stdout);
        });
      });
    }
    else {
      return reject(new Error("Unsupported language"));
    }
  });
};

module.exports = executeCode;