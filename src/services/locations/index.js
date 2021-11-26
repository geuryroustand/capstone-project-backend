import locationSchema from "./locationSchema.js";
import q2m from "query-to-mongo";
import express from "express";

const locationsRouter = express.Router();

locationsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const query1 = req.query;
    console.log(query1);
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

    const { _id } = createNewLocation;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});

locationsRouter.post("/search", async (req, res, next) => {
  try {
    let searchedLocations = req.body.location;

    let findLocation = await locationSchema
      .find({
        location: { $regex: new RegExp(".*" + searchedLocations + ".*", "i") },
      })
      .limit(10)
      .exec();

    console.log(searchedLocations);
    res.send(findLocation);

    // const createNewLocation = await locationSchema.create(req.body);

    // const { _id } = createNewLocation;

    res.send(req.body);
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
