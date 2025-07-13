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

    const inputFilePath = path.join(outputsDir, `${jobId}_input.txt`);
    fs.writeFileSync(inputFilePath, input);

    // save code to file
    if (language === "cpp") {
      filename = `${jobId}.cpp`;
      filepath = path.join(codesDir, filename);
      fs.writeFileSync(filepath, code);

      const outputFile = path.join(outputsDir, `${jobId}.out`);
      const compileCmd = `g++ "${filepath}" -o "${outputFile}" -std=c++17`;

      const cleanup = () => {
        const filesToClean = [filepath, inputFilePath, outputFile];
        filesToClean.forEach(file => {
          try {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          } catch (e) {
            console.warn("Cleanup failed:", e.message);
          }
        });
      };

      //compile
      exec(compileCmd, { timeout: 10000 }, (compileErr, _, compileStdErr) => {
        if (compileErr || compileStdErr) {
          cleanup();
          return reject(new Error(compileStdErr || compileErr.message));
        }

        const runCmd = `timeout 5s "${outputFile}" < "${inputFilePath}"`;
        exec(runCmd, { timeout: 6000 }, (runErr, stdout, stderr) => {
          cleanup();
          if (runErr) {
            if (runErr.code === 124) {
              return reject(new Error("Time Limit Exceeded"));
            }
            return reject(new Error(stderr || runErr.message));
          }
          if (stderr) {
            return reject(new Error(stderr));
          }
          return resolve(stdout);
        });
      });
    }

    else if (language === "python") {
      filename = `${jobId}.py`;
      filepath = path.join(codesDir, filename);
      fs.writeFileSync(filepath, code);

      const runCmd = `timeout 5s python3 "${filepath}" < "${inputFilePath}"`;

      const cleanup = () => {
        const filesToClean = [filepath, inputFilePath];
        filesToClean.forEach(file => {
          try {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          } catch (e) {
            console.warn("Cleanup failed (Python):", e.message);
          }
        });
      };

      exec(runCmd, { timeout: 6000 }, (err, stdout, stderr) => {
        cleanup();
        if (err) {
          if (err === 124) {
            return reject(new Error("Time Limit Exceeded"));
          }
          return reject(new Error(stderr || err.message));
        }
        if (stderr) {
          return reject(new Error(stderr));
        }
        return resolve(stdout);
      });
    }

    else if (language === "java") {
      const publicClassMatch = code.match(/public\s+class\s+(\w+)/);

      if (publicClassMatch) {
        // Traditional approach: filename must match class name
        const className = publicClassMatch[1];
        filename = `${className}.java`;
        filepath = path.join(codesDir, filename);
        fs.writeFileSync(filepath, code);

        const compileCmd = `javac "${filepath}"`;
        const classFile = path.join(codesDir, `${className}.class`);
        const runCmd = `timeout 5s java -cp "${codesDir}" ${className} < "${inputFilePath}"`;

        const cleanup = () => {
          const filesToClean = [filepath, inputFilePath, classFile];
          filesToClean.forEach(file => {
            try {
              if (fs.existsSync(file)) {
                fs.unlinkSync(file);
              }
            } catch (e) {
              console.warn("Cleanup failed (Java):", e.message);
            }
          });
        };

        exec(compileCmd, { timeout: 15000 }, (compileErr, _, compileStderr) => {
          if (compileErr || compileStderr) {
            cleanup();
            return reject(new Error(compileStderr || compileErr.message));
          }

          exec(runCmd, { timeout: 6000 }, (runErr, stdout, stderr) => {
            cleanup();
            if (runErr) {
              if (runErr.code === 124) {
                return reject(new Error("Time Limit Exceeded"));
              }
              return reject(new Error(stderr || runErr.message));
            }
            if (stderr) {
              return reject(new Error(stderr));
            }
            return resolve(stdout);
          });
        });
      }

      else {
        // Java 11+ direct execution (no public class)
        filename = `${jobId}.java`;
        filepath = path.join(codesDir, filename);
        fs.writeFileSync(filepath, code);

        const runCmd = `timeout 5s java "${filepath}" < "${inputFilePath}"`;

        const cleanup = () => {
          const filesToClean = [filepath, inputFilePath];
          filesToClean.forEach(file => {
            try {
              if (fs.existsSync(file)) {
                fs.unlinkSync(file);
              }
            } catch (e) {
              console.warn("Cleanup failed (Java direct):", e.message);
            }
          });
        };

        exec(runCmd, { timeout: 6000 }, (err, stdout, stderr) => {
          cleanup();
          if (err) {
            if (err.code === 124) {
              return reject(new Error("Time Limit Exceeded"));
            }
            return reject(new Error(stderr || err.message));
          }
          if (stderr) {
            return reject(new Error(stderr));
          }
          return resolve(stdout);
        });
      }
    }
    else {
      // Clean up input file for unsupported languages
      try {
        if (fs.existsSync(inputFilePath)) {
          fs.unlinkSync(inputFilePath);
        }
      } catch (e) {
        console.warn("Cleanup failed:", e.message);
      }
      return reject(new Error("Unsupported language"));
    }
  });
};

module.exports = executeCode;