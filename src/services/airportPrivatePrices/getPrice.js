import createHttpError from "http-errors";

const prices = {
  //// ###############################
  //// From Santo Domingo
  ////################################

  "santoDomingoA-samanaA": 199,
  "samanaA-santoDomingoA": 199,
  "santoDomingoA-samanaB": 239,
  "samanaB-santoDomingoA": 239,
  "santoDomingoA-puntaCanaA": 155,
  "puntaCanaA-santoDomingoA": 155,
  "santoDomingoA-puntaCanaB": 155,
  "puntaCanaB-santoDomingoA": 155,
  "santoDomingoA-laRomanaA": 89,
  "laRomanaA-santoDomingoA": 89,
  "santoDomingoA-laRomanaB": 89,
  "laRomanaB-santoDomingoA": 89,
  "santoDomingoA-santoDomingoA": 39,
  "santoDomingoA-puertoPlataA": 219,
  "puertoPlataA-santoDomingoA": 219,
  "santoDomingoA-puertoPlataB": 240,
  "puertoPlataB-santoDomingoA": 240,
  // continue mapping for all other regions
};

// export const getPrice = (pickUp, dropOff, roundtrip, next) => {
//   const code = `${pickUp._id}&${dropOff._id}`;

//   const key = `${pickUp.region}-${dropOff.region}`;
//   const price = prices[key];

//   if (!price)
//     return next(
//       createHttpError(
//         404,
//         `Sorry, we have a problem searching the prices for your destination :(, Please contact us at info@vacationstaxis.com to quote your transfer also send us this discount code for 5% OFF of the total ${code}`
//       )
//     );
//   return roundtrip ? price * 2 : price;
// };

export const getPrice = (pickUp, dropOff, roundtrip, next) => {
  const regions = new Map([
    [
      "santoDomingoA",
      [
        ["samanaA", 189],
        ["samanaB", 214],
        ["puntaCanaA", 156],
        ["puntaCanaB", 179],
        ["laRomanaA", 99],
        ["laRomanaB", 89],
        ["santoDomingoA", 49],
        ["puertoPlataA", 219],
        ["puertoPlataB", 239],
      ],
    ],
    [
      "samanaA",
      [
        ["samanaA", 89],
        ["samanaB", 89],
        ["puntaCanaA", 329],
        ["puntaCanaB", 329],
        ["puertoPlataA", 189],
        ["puertoPlataB", 209],
        ["santoDomingoA", 189],
      ],
    ],
    [
      "samanaB",
      [
        ["samanaA", 89],
        ["santoDomingoA", 219],
        ["puntaCanaA", 349],
        ["puntaCanaB", 349],
        ["puertoPlataA", 209],
        ["puertoPlataB", 219],
      ],
    ],

    [
      "puntaCanaA",
      [
        ["puntaCanaA", 36],
        ["puntaCanaB", 58],

        ["laRomanaA", 99],
        ["laRomanaB", 129],

        ["santoDomingoA", 189],

        ["puertoPlataA", 369],
        ["puertoPlataB", 369],

        ["samanaA", 329],
        ["samanaB", 329],

        ["santiagoA", 349],
      ],
    ],

    [
      "puntaCanaB",
      [
        ["puntaCanaB", 36],
        ["puntaCanaA", 58],

        ["laRomanaA", 99],
        ["laRomanaB", 129],

        ["santoDomingoA", 179],

        ["puertoPlataA", 369],
        ["puertoPlataB", 369],

        ["samanaA", 329],
        ["samanaB", 339],

        ["santiagoA", 349],
      ],
    ],
    [
      "puertoPlataA",
      [
        ["puntaCanaB", 369],
        ["puntaCanaA", 369],

        ["laRomanaA", 299],
        ["laRomanaB", 299],

        ["santoDomingoA", 239],

        ["puertoPlataA", 59],
        ["puertoPlataB", 59],

        ["samanaA", 199],
        ["samanaB", 219],

        ["santiagoA", 119],
      ],
    ],

    // Add entries for the rest of the regions
  ]);
  const code = `${pickUp._id}&${dropOff._id}`;

  const price = regions
    .get(pickUp.region)
    ?.find(([dropOffRegion]) => dropOffRegion === dropOff.region)?.[1];

  if (!price)
    next(
      createHttpError(
        404,
        `Sorry, we had a problem searching the prices for your destination :( Please contact us at info@vacationstaxis.com to quote your transfer also send us this ${code} discount code for 10% OFF`
      )
    );

  const totalDiscount = (5 / 100) * (price * 2);

  return roundtrip === "false" ? price : price * 2 - totalDiscount;
};

// export const getPrice = (pickUp, dropOff, roundtrip, next) => {
//   const code = `${pickUp._id}&${dropOff._id}`;
//   // ###############################
//   // From Santo Domingo
//   //################################

//   if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "samanaA") ||
//     (pickUp.region === "samanaA" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 199 * 2 : 199;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "samanaB") ||
//     (pickUp.region === "samanaB" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 239 * 2 : 239;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaA" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 155 * 2 : 155;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "puntaCanaB") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 155 * 2 : 155;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 89 * 2 : 89;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 89 * 2 : 89;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "santoDomingoA") ||
//     (pickUp.region === "santoDomingoA" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 39 * 2 : 39;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 219 * 2 : 219;
//   } else if (
//     (pickUp.region === "santoDomingoA" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "santoDomingoA")
//   ) {
//     return roundtrip ? 240 * 2 - 10 : 240;
//   }

//   // ###############################
//   // From Samana
//   //################################

//   if (
//     (pickUp.region === "samanaA" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaA" && dropOff.region === "samanaA") ||
//     (pickUp.region === "samanaA" && dropOff.region === "puntaCanaB") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 329 * 2 - 10 : 329;
//   } else if (
//     (pickUp.region === "samanaB" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaA" && dropOff.region === "samanaB") ||
//     (pickUp.region === "samanaB" && dropOff.region === "puntaCanaB") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "samanaB")
//   ) {
//     return roundtrip ? 349 * 2 - 10 : 349;
//   } else if (
//     (pickUp.region === "samanaA" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 199 * 2 - 10 : 199;
//   } else if (
//     (pickUp.region === "samanaA" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 169 * 2 - 10 : 169;
//   } else if (
//     (pickUp.region === "samanaB" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "samanaB")
//   ) {
//     return roundtrip ? 219 * 2 - 10 : 219;
//   } else if (
//     (pickUp.region === "samanaB" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "samanaB")
//   ) {
//     return roundtrip ? 179 * 2 - 10 : 179;
//   } else if (
//     (pickUp.region === "samanaA" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "samanaA") ||
//     (pickUp.region === "samanaA" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 249 * 2 - 10 : 249;
//   } else if (
//     (pickUp.region === "samanaB" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "samanaB")
//   ) {
//     return roundtrip ? 299 * 2 - 10 : 299;
//   } else if (
//     (pickUp.region === "samanaA" && dropOff.region === "samanaA") ||
//     (pickUp.region === "samanaA" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 115 * 2 - 10 : 115;
//   } else if (
//     (pickUp.region === "samanaA" && dropOff.region === "samanaB") ||
//     (pickUp.region === "samanaB" && dropOff.region === "samanaA")
//   ) {
//     return roundtrip ? 120 * 2 - 10 : 120;
//   }

//   // ###############################
//   // From Punta Cana
//   //################################

//   if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaA" && dropOff.region === "puntaCanaA")
//   ) {
//     return roundtrip ? 49 * 2 - 10 : 49;
//   } else if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "puntaCanaB") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "puntaCanaA")
//   ) {
//     return roundtrip ? 79 * 2 - 10 : 79;
//   } else if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "puntaCanaB")
//   ) {
//     return roundtrip ? 99 * 2 - 10 : 99;
//   } else if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "puntaCanaA")
//   ) {
//     return roundtrip ? 139 * 2 - 10 : 139;
//   } else if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "puntaCanaB")
//   ) {
//     return roundtrip ? 369 * 2 - 10 : 369;
//   } else if (
//     (pickUp.region === "puntaCanaA" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "puntaCanaA") ||
//     (pickUp.region === "puntaCanaB" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "puntaCanaB")
//   ) {
//     return roundtrip ? 349 * 2 - 10 : 349;
//   }

//   // ###############################
//   // From Puerto Plata
//   //################################

//   if (
//     (pickUp.region === "puertoPlataA" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "puertoPlataA")
//   ) {
//     return roundtrip ? 59 * 2 - 10 : 59;
//   } else if (
//     (pickUp.region === "puertoPlataA" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "puertoPlataA")
//   ) {
//     return roundtrip ? 129 * 2 - 10 : 129;
//   } else if (
//     (pickUp.region === "puertoPlataA" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "puertoPlataA") ||
//     (pickUp.region === "puertoPlataA" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "puertoPlataA")
//   ) {
//     return roundtrip ? 299 * 2 - 10 : 299;
//   } else if (
//     (pickUp.region === "puertoPlataB" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "puertoPlataB") ||
//     (pickUp.region === "puertoPlataB" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "puertoPlataB")
//   ) {
//     return roundtrip ? 259 * 2 - 10 : 259;
//   }

//   // ###############################
//   // From Romana
//   //################################

//   if (
//     (pickUp.region === "laRomanaA" && dropOff.region === "laRomanaA") ||
//     (pickUp.region === "laRomanaA" && dropOff.region === "laRomanaA")
//   ) {
//     return roundtrip ? 59 * 2 - 10 : 59;
//   } else if (
//     (pickUp.region === "laRomanaA" && dropOff.region === "laRomanaB") ||
//     (pickUp.region === "laRomanaB" && dropOff.region === "laRomanaA")
//   ) {
//     return roundtrip ? 79 * 2 - 10 : 79;
//   } else {
//     next(
//       createHttpError(
//         404,
//         `Sorry, we have a problem searching the prices for your destination :(, Please contact us at info@vacationstaxis.com to quote your transfer also send us this discount code for 5% OFF of the total ${code}`
//       )
//     );
//   }
// };
