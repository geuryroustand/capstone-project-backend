import createHttpError from "http-errors";

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
      "santoDomingoB",
      [
        ["samanaA", 219],
        ["samanaB", 229],
        ["puntaCanaA", 209],
        ["puntaCanaB", 219],
        ["laRomanaA", 149],
        ["laRomanaB", 119],
        ["santoDomingoA", 49],
        ["puertoPlataA", 219],
        ["puertoPlataB", 239],
      ],
    ],
    [
      "samanaA",
      [
        ["samanaA", 77],
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
    [
      "santiagoA",
      [
        ["puntaCanaA", 349],
        ["puntaCanaB", 369],
        ["laRomanaA", 289],
        ["laRomanaB", 299],
        ["santoDomingoA", 189],
        ["puertoPlataA", 149],
        ["puertoPlataB", 149],
        ["samanaA", 229],
        ["samanaB", 249],
        ["santiagoA", 49],
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

  const totalDiscount = Math.floor(5 / 100) * (price * 2);

  return roundtrip === "false" ? price : Math.round(price * 2 - totalDiscount);
};
