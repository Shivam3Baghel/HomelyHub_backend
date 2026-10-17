import express from "express";
import {getAllProperties,getProperty} from "../controllers/propertyController.js";

const propertyRouter=express.Router();

propertyRouter.route("/").get(getAllProperties);
propertyRouter.route("/:id").get(getProperty);
export {propertyRouter};