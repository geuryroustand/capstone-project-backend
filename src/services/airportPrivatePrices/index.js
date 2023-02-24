import express from "express";
import q2m from "query-to-mongo";
import locationSchema from "../locations/locationSchema.js";
import { getPrice } from "./getPrice.js";
import privateTransfersSchema from "./privateTransfersSchema.js";

const addPrivatePriceRouter = express.Router();

addPrivatePriceRouter.get("/addPrices", async (req, res, next) => {
  try {
    let query = q2m(req.query);

    // const getPickupPlace = await locationSchema.find({
    //   location: `${req.query.pickupPlace}`,
    // });

    const getPickupPlace = await locationSchema.findById(req.query.pickUp);

    // const getDropLocation = await locationSchema.find({
    //   location: `${req.query.dropPlace}`,
    // });

    const getDropLocation = await locationSchema.findById(req.query.dropOff);
    const roundtrip = req.query.roundtrip;

    // console.log("getDropLocation", getDropLocation);

    // const [searchedPickUpLocation] = getPickupPlace;
    // const [searchedDropOffLocation] = getDropLocation;

    const result = getPrice(getPickupPlace, getDropLocation, roundtrip, next);

    res.send({
      priceTaxi1: result,
      priceTaxi2: result + 15.99,
      priceTaxi3: result + 20.99,
      priceTaxi4: result + 65.56,

      pickUp: getPickupPlace.location,
      dropOff: getDropLocation.location,
    });

    // console.log(searchedDropOffLocation);
    // console.log(searchedPickUpLocation.region);
    // console.log(searchedDropOffLocation.region);

    // if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "samanaA") ||
    //   (searchedPickUpLocation.region === "samanaA" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "199" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "samanaB") ||
    //   (searchedPickUpLocation.region === "samanaB" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "239" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "puntaCanaA") ||
    //   (searchedPickUpLocation.region === "puntaCanaA" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "155" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "puntaCanaB") ||
    //   (searchedPickUpLocation.region === "puntaCanaB" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "155" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "laRomanaA") ||
    //   (searchedPickUpLocation.region === "laRomanaA" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "89" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "laRomanaB") ||
    //   (searchedPickUpLocation.region === "laRomanaB" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "89" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "santoDomingoA") ||
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "39" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "puertoPlataA") ||
    //   (searchedPickUpLocation.region === "puertoPlataA" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "219" });
    // } else if (
    //   (searchedPickUpLocation.region === "santoDomingoA" &&
    //     searchedDropOffLocation.region === "puertoPlataB") ||
    //   (searchedPickUpLocation.region === "puertoPlataB" &&
    //     searchedDropOffLocation.region === "santoDomingoA")
    // ) {
    //   res.send({ price: "240" });
    // }

    // const drop = getDropLocation.find((drop) => drop);
    // const pick = getPickupPlace.find((pick) => pick);

    // const findBoth = await privateTransfersSchema
    //   .find({
    //     $and: [{ pickupPlace: { $eq: pick } }, { dropPlace: { $eq: drop } }],
    //   })
    //   .limit(query.options.limit)
    //   .skip(query.options.skip)
    //   .sort(query.options.sort)
    //   .populate("pickupPlace")
    //   .populate("dropPlace");

    // res.send(findBoth);
  } catch (error) {
    next(error);
  }
});

addPrivatePriceRouter.post("/addPrices", async (req, res, next) => {
  try {
    const addPrices = await privateTransfersSchema.create(req.body);

    const { _id } = addPrices;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});

export default addPrivatePriceRouter;
