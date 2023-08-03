import { connect } from 'mongoose';
import "dotenv/config";
import config from "./config.js";

export async function connectMongo() {
  try {
    await connect(
      config.mongoUrl
      );
    console.log("Connected succesfuly to MongoDB");
  } catch (e) {
    console.log(e);
    throw "Can not connect to mongo";
  }
}
