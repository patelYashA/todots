import mongoose from "mongoose";
import { environment as config } from "./environment"; 
import { constants } from "./constants"; 

const DB: string = config.database.uri || ""; 

const connection = mongoose.connection;

// Function to connect to the database
export const connect = (): void => {
  mongoose.connect(DB, constants.database.options).catch((err) => {
    console.error("Initial connection error:", err);
    process.exit(1);
  });
};

// Connection event listeners
connection
  .on("connected", () => {
    console.log("%s Database Connected", "✔");
  })
  .on("disconnected", () => {
    console.log("%s Database Disconnected", "✗");
  })
  .on("error", (err) => {
    console.error(err);
    console.log(
      "%s MongoDB connection error. Please make sure MongoDB is running.",
      "✗"
    );
    process.exit(1);
  });

// Handle application termination
process.on("SIGINT", () => {
  connection
    .close()
    .then(() => {
      console.log(
        "%s Mongoose default connection is disconnected due to application termination.",
        "✗"
      );
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error in closing database connection", err);
    });
});
