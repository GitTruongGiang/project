const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Airlines = require("../models/airlines");
const Chair = require("../models/chair");
const Flight = require("../models/flight");
const Plane = require("../models/plane");
mongoose
  .connect(
    "mongodb+srv://booking:booking-1@booking.9y2xj85.mongodb.net/booking"
  )
  .then(() => console.log("connect succsess"))
  .catch((error) => console.log(error));

const fakerFlights = async () => {
  const airlines = await Airlines.find({});
  const airlinesId = airlines.map((airline) => airline._id);
  let dataPlanes = [];
  //faker planes
  // for (i = 0; i < 400; i++) {
  //   const data = {
  //     name: faker.random.alpha({ count: 5, casing: "upper" }),
  //     codePlane: faker.random.alphaNumeric(6, { casing: "upper" }),
  //   };
  //   dataPlanes.push(data);
  // }

  // for (let i = 0; i < 100; i++) {
  //   for (let j = 0; j < airlines.length; j++) {
  //     await Plane.create({
  //       name: faker.random.alpha({ count: 5, casing: "upper" }),
  //       codePlane: faker.random.alphaNumeric(6, { casing: "upper" }),
  //       authorAirlines: airlines[j],
  //     });
  //   }
  // }
  // console.log(dataPlanes.length);

  let dataFlight = [];
  const planes = await Plane.find({}).populate("authorAirlines");
  const planesId = planes.map((plane) => plane._id);
  const planesCode = planes.map((plane) => plane.codePlane);
  for (j = 0; j < 100; j++) {
    for (i = 0; i < planes.length; i++) {
      const contrys = [
        "sg",
        "dn",
        "dna",
        "bv",
        "ag",
        "hn",
        "dl",
        "tth",
        "ld",
        "kh",
      ];
      const data = {
        airlines: planes[i].authorAirlines._id,
        fromDay: faker.date.between(
          `${new Date("2022, 10, 1")}`,
          `${new Date("2022, 10, 30")}`
        ),
        timeFrom: faker.date.between(
          `${new Date("2022, 10, 1")}`,
          `${new Date("2022, 10, 30")}`
        ),
        timeTo: faker.date.between(
          `${new Date("2022, 10, 1")}`,
          `${new Date("2022, 10, 30")}`
        ),
        price: faker.commerce.price(700000, 3000000, 0),
        imageUrl: faker.image.image(960, 640, true),
        from: contrys[Math.floor(Math.random() * contrys.length)],
        to: contrys[Math.floor(Math.random() * contrys.length)],
        plane: planesId[i],
        codePlane: planesCode[i],
      };
      dataFlight.push(data);
    }
  }

  dataFlight = dataFlight.filter((data) => {
    if (data.from !== data.to) {
      return data;
    }
  });
  dataFlight.map((flight) => {
    const date = new Date(flight.fromDay).getDate();
    const month = new Date(flight.fromDay).getMonth();
    const year = new Date(flight.fromDay).getFullYear();
    flight.fromDay = new Date(year, month, date);
  });
  // for (i = 0; i < dataFlight.length; i++) {
  //   dataFlight[i].plane = planesId[i];
  //   dataFlight[i].codePlane = planesCode[i];
  // }
  console.log(dataFlight);
  dataFlight.map(async (flight) => {
    let countFlight = await Flight.create({
      airlines: flight.airlines,
      fromDay: flight.fromDay,
      timeFrom: flight.timeFrom,
      timeTo: flight.timeTo,
      price: flight.price,
      imageUrl: flight.imageUrl,
      from: flight.from,
      to: flight.to,
      plane: flight.plane,
      codePlane: flight.codePlane,
    });
    let String = ["a", "b", "c", "d", "e", "f"];
    for (let i = 1; i < 24 / 4 + 1; i++) {
      for (let j = 1; j < 4 + 1; j++) {
        resultNumber = i - 1;
        let chair = await Chair.insertMany({
          flight: countFlight._id,
          codeNumber: j,
          codeString: String[resultNumber],
        });
      }
    }
  });
};
fakerFlights();
