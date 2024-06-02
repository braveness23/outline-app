import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";

export type Process<T extends StepSettings> = (image: cv.Mat, settings: T) => cv.Mat;

export type StepSettings = {
  [key: string]: any;
};

interface ProcessingStep<T extends StepSettings> {
  name: StepName;
  settings: T;
  outputColorSpace: ColorSpace;
  process: Process<T>;
}

export default ProcessingStep;
