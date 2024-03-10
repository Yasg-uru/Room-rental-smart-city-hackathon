import mongoose from "mongoose";
const connectDatabase = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Room-rental")
    .then((data) => {
      console.log(
        `mongo db is connected with server : ${data.connection.host}`
      );
    })
    .catch((error) => {
      console.log(`error is occurend in connection of mongo db:${error}`);
    });
};
export default connectDatabase;
