import locationSchema from "./locationSchema.js";
import q2m from "query-to-mongo";
import express from "express";
import createHttpError from "http-errors";

const locationsRouter = express.Router();

locationsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    const getLocations = await locationSchema
      .find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);
    // .populate("locationsPrices");

    res.send(getLocations);
  } catch (error) {
    next(error);
  }
});

// locationsRouter.post("/", async (req, res, next) => {
//   try {
//     let payload = req.body.payload.trim();

//     const query = q2m(req.query);
//     const query1 = req.query;
//     console.log(query1);
//     const getLocations = await locationSchema
//       // new RegExp("/^" + query + "/", "i")
//       // { location: { $regex: new RegExp("^" + query + ".*", "i") } }
//       .find({ location: { $regex: new RegExp("^" + payload + ".*", "i") } })
//       .exec();

//     // .limit(query.options.limit)
//     // .skip(query.options.skip)
//     // .sort(query.options.sort);
//     // .populate("locationsPrices");

//     res.send(getLocations);
//   } catch (error) {
//     next(error);
//   }
// });

locationsRouter.post("/", async (req, res, next) => {
  try {
    const createNewLocation = await locationSchema.create(req.body);

    // const { _id } = createNewLocation;

    res.send(createNewLocation);
  } catch (error) {
    next(error);
  }
});

locationsRouter.post("/search", async (req, res, next) => {
  try {
    let searchedLocations = await req.body.location;

    if (!searchedLocations) {
      return next(createHttpError("req body cannot be empty"));
    }
    let findLocation = await locationSchema
      .find({
        location: { $regex: new RegExp(".*" + searchedLocations + ".*", "i") },
      })
      .limit(6)
      .exec();

    res.status(200).send(findLocation);

    // const createNewLocation = await locationSchema.create(req.body);

    // const { _id } = createNewLocation;
  } catch (error) {
    next(error);
  }
});

locationsRouter.put("/:locationId", async (req, res, next) => {
  try {
    const createNewLocation = await locationSchema.findByIdAndUpdate(
      req.params.locationId,
      req.body,
      {
        new: true,
      }
    );

    const { _id } = createNewLocation;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});
export default locationsRouter;
