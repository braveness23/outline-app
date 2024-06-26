import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";

type CannySettings = {
  firstThreshold: number;
  secondThreshold: number;
};

const cannyOf: Process<CannySettings> = (
  image: cv.Mat,
  settings: CannySettings
): ProcessResult => {
  let canny = new cv.Mat();
  cv.Canny(image, canny, settings.firstThreshold, settings.secondThreshold);
  return { image: canny };
};

const cannyStep: ProcessingStep<CannySettings> = {
  name: StepName.CANNY,
  settings: {
    firstThreshold: 100,
    secondThreshold: 200,
  },
  config: {
    firstThreshold: {
      type: "number",
      min: 0,
      max: 255,
    },
    secondThreshold: {
      type: "number",
      min: 0,
      max: 255,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: cannyOf,
};

export default cannyStep;