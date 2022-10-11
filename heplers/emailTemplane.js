const emailTemplane = {};

emailTemplane.sendBooking = async ({ flight, chair }) => {
  const date = new Date(flight.fromDay).getDate();
  const month = new Date(flight.fromDay).getMonth() + 1;
  const year = new Date(flight.fromDay).getFullYear();

  const hoursfrom = new Date(flight.timeFrom).getHours();
  const minutefrom = new Date(flight.timeFrom).getMinutes();

  const hoursto = new Date(flight.timeTo).getHours();
  const minuteto = new Date(flight.timeTo).getMinutes();
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  <h1>Hello, i come from ${flight.airlines.name}</h1>
  <h3>you booking flight date: ${date}-${month}-${year} , Number chair: ${chair.codeNumber}${chair.codeString} </h3>
  <h3>Time From: ${hoursfrom}h ${minutefrom}min </h3>
  <h3>Time to: ${hoursto}h ${minuteto}min</h3>
  </body>
  </html>`;
};

module.exports = emailTemplane;
