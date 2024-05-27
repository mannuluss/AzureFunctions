import * as fs from "fs";

export function convertToFile(blob) {
  var base64Image = Buffer.from(blob, "binary")//.toString("base64");
  return base64Image;
  // fs.writeFile(
  //   row["photo_desc"],
  //   base64Image,
  //   { encoding: "base64" },
  //   function (err) {
  //     console.log("File created");
  //   }
  // );
}
