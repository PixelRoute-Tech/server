const fs = require("fs/promises");
const path = require("path");
const FS = require("fs");
exports.saveJsonFile = async (filePath, data) => {
  try {
    const dir = path.dirname(filePath);

    // ✅ Ensure directory exists
    try {
      await fs.access(dir);
    } catch {
      console.log("Directory does not exist → creating...");
      await fs.mkdir(dir, { recursive: true });
    }

    // Convert data to formatted JSON

    // ✅ Check if file exists
    let fileExists = true;
    try {
      await fs.access(filePath);
    } catch {
      fileExists = false;
    }

    if (!fileExists) {
      console.log("File does not exist → creating new file...");
    } else {
      console.log("File exists → overwriting...");
    }
    await fs.writeFile(filePath, data, "utf-8");

    console.log("JSON saved successfully!");
  } catch (error) {
    throw new Error("Error saving JSON:", error);
  }
};

exports.deleteIfExists = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filePath = path.join(process.cwd(), fileUrl);
    if (FS.existsSync(filePath)) {
      FS.unlinkSync(filePath);
    }
  } catch (error) {
    console.log("Error in file delete Function", error);
  }
};

const getFolderTree = async (dirPath, basePath = "") => {
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  return Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        return {
          type: "folder",
          name: item.name,
          size:"",
          path: relativePath,
          children: await getFolderTree(fullPath, relativePath),
        };
      } else {
        const stats = await fs.stat(fullPath);
        return {
          type: "file",
          name: item.name,
          size: stats.size,
          path: relativePath,
        };
      }
    })
  );
};

exports.fetchFolderTree = getFolderTree;
