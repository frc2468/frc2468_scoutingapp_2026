import { ref, remove, set, child } from "firebase/database";

export class Encoder {
  constructor() {
    this.rawDataToEncode = [];
    this.formattedJsonData = {};
  }

  /**
   * Converts an array into a labeled object
   * @param {Array} arr
   * @param {Array<string>} labels
   */
  rawDataToFormattedData(arr, labels) {
    this.rawDataToEncode = arr;
    this.formattedJsonData = {};

    for (let i = 0; i < labels.length; i++) {
      this.formattedJsonData[String(labels[i])] = arr[i];
    }

    return this.formattedJsonData;
  }

  /**
   * Uploads formatted data to Firebase safely
   * ALL PATH PARTS ARE FORCED TO STRINGS
   */
  uploadFormattedData(database, data, dataStructure) {
    try {
      // 🔒 Always force Firebase paths to strings
      const basePath = String(dataStructure.getPath("Matches"));

      const match = String(data["Match"]);
      const position = String(data["Position"]);
      const scout = String(data["Scout"]);

      const key = `${match}-${position}-${scout}`;

      const parentRef = ref(database, basePath);
      const matchRef = child(parentRef, key + "/");

      // Remove existing entry
      remove(matchRef);

      // Set new data
      set(matchRef, data);

      return true;
    } catch (err) {
      console.error("Encoder upload error:", err);
      return err.message;
    }
  }
}
