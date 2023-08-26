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

locationsRouter.post("/", async (req, res, next) => {
  try {
    const createNewLocation = await locationSchema.create(req.body);

    // const { _id } = createNewLocation;

    res.send(createNewLocation);
  } catch (error) {
    next(error);
  }
});

locationsRouter.get("/search", async (req, res, next) => {
  try {
    let searchedLocations = req.query.location;

    if (!searchedLocations) {
      return next(createHttpError(404, "Please provide a location"));
    }

    // FullText Search

    let locations = await locationSchema.aggregate([
      {
        $search: {
          index: "fullTextSearchJSON",
          text: {
            query: searchedLocations,
            path: "location",
            fuzzy: {
              maxEdits: 1,
            },
          },

          // index: "autoCompleteSearchText",
          // autocomplete: {
          //   query: searchedLocations,
          //   path: "location",
          //   fuzzy: {
          //     maxEdits: 2,
          //   },
          // },
        },
      },
      {
        $limit: 6,
      },
    ]);

    if (!locations.length)
      return next(createHttpError(404, "Oh Oh, We did not find that location"));

    res.status(200).send(locations);
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
