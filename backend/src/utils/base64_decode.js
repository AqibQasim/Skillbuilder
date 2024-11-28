const { existsSync, mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");

const base64_decode = (base64Image, fileName, targetDir) => {
  try {
    if (!existsSync(targetDir)) {
      // Create the directory if it does not exist
      mkdirSync(targetDir, { recursive: true });
    }

    // Define the full file path
    const filePath = join(targetDir, fileName);

    // Write the file
    writeFileSync(filePath, base64Image, { encoding: "base64" });
    console.log("******** File created from base64 encoded string ********");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { base64_decode };
