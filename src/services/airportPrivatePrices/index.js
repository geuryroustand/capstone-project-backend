import express from "express";
import q2m from "query-to-mongo";
import locationSchema from "../locations/locationSchema.js";
import privateTransfersSchema from "./privateTransfersSchema.js";

const addPrivatePriceRouter = express.Router();

addPrivatePriceRouter.get("/addPrices", async (req, res, next) => {
  try {
    let query = q2m(req.query);

    let { pickupPlace, dropPlace } = query.criteria;
    // let payload = req.query.pickupPlace.trim();
    // console.log(pickupPlace, dropPlace);

    // .find({ location: { $regex: new RegExp("^" + payload + ".*", "i") } })
    //   .exec()
    // console.log(req.query.pickupPlace);
    // ${req.query.pickupPlace}

    const getPickupPlace = await locationSchema.find({
      location: `${req.query.pickupPlace}`,
    });

    const getDropLocation = await locationSchema.find({
      location: `${req.query.dropPlace}`,
    });

    // const findBoth = await privateTransfersSchema.find({
    //   $and: [
    //     { "pickupPlace.location": { $eq: getPickupPlace.location } },
    //     { "dropPlace.location": { $eq: getDropLocation.location } },
    //   ],
    // });

    // const { _id } = getDropLocation.toString();
    // console.log(getPickupPlace);
    const drop = getDropLocation.find((drop) => drop);
    const pick = getPickupPlace.find((pick) => pick);

    console.log("=============================================");

    // console.log(drop.location);
    // console.log(pick.location);
    // const findBothT = await privateTransfersSchema.find({
    //   " location.dropPlace": a.location,
    // });

    // new RegExp(`^${req.query.pickupPlace}`, "i")
    // console.log(getPickupPlace, getDropLocation);

    // 1. Use the regular expression to search for locations with the LocationSchema
    // 2. You will get some _ids
    // 3. You need to use those ids to search into privateTransfer collection by "pickupPlace"

    // {
    //   "pickupPlace.location": {
    //     $regex: new RegExp(`^${req.query.pickupPlace}`, "i"),
    //   },
    // }

    const findBoth = await privateTransfersSchema
      .find({
        $and: [{ pickupPlace: { $eq: pick } }, { dropPlace: { $eq: drop } }],
      })
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort)
      .populate("pickupPlace")
      .populate("dropPlace");

    res.send(findBoth);
  } catch (error) {
    next(error);
  }
});

// addPrivatePriceRouter.get("/addPrices/:ValuePassed", async (req, res, next) => {
//   try {
//     const query = q2m(req.query);

//     // console.log(req.params.ValuePassed);

//     // let { pickupPlace, dropPlace } = query.criteria;

//     // console.log(pickupPlace, dropPlace);

//     // console.log(query);
//     // .find({ location: { $regex: new RegExp("^" + payload + ".*", "i") } })
//     //   .exec()

//     const getBookingDetails = await privateTransfersSchema
//       .findOneAndUpdate({ pickupPlace: req.params.ValuePassed.toString() })
//       // .limit(query.options.limit)
//       // .skip(query.options.skip)
//       // .sort(query.options.sort)
//       .populate("pickupPlace")
//       .populate("dropPlace");

//     res.send(getBookingDetails);
//   } catch (error) {
//     next(error);
//   }
// });
// addPrivatePriceRouter.get("/addPrices/:priceId", async (req, res, next) => {
//   try {
//     const addPrices = await privateTransfersSchema.findById(req.params.priceId);

//     res.send(addPrices);
//   } catch (error) {
//     next(error);
//   }
// });
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
