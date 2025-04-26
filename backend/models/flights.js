const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flightSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  airline: String,
  confirmationNumber: String,
  passengerFirstName: String,
  passengerLastName: String,
  departureTime: Date,
  checkinCompleted: { type: Boolean, default: false },
  boardingPassUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Flight", flightSchema);
