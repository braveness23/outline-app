import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";

import { StepResult } from "../StepResult";
import ProcessingStep, { ProcessResult } from "./steps/ProcessingFunction";
import bilateralFilterStep from "./steps/BilateralFilter";
import grayScaleStep from "./steps/GrayScale";
import blurStep from "./steps/Blur";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import extractPaperStep from "./steps/ExtractPaper";
import extractObjectStep from "./steps/ExtractObject";
import imageDataOf, { imageOf } from "../util/ImageData";
import StepSetting from "./steps/StepSettings";
import handleOpenCvError from "../OpenCvError";
import cannyStep from "./steps/Canny";
import StepName from "./steps/StepName";
import thresholdStep from "./steps/Threshold";

export type IntermediateImages = {
  [key in StepName]?: cv.Mat;
};

export const PROCESSING_STEPS: ProcessingStep<any>[] = [
  bilateralFilterStep,
  grayScaleStep,
  blurStep,
  adaptiveThresholdStep,
  cannyStep,
  extractPaperStep,
  thresholdStep,
  cannyStep,
  extractObjectStep,
];

export type ProcessingResult = {
  results?: StepResult[];
  error?: string;
};

type ProcessStepResult =
  | {
      type: "success";
      stepResult: ProcessResult;
    }
  | {
      type: "error";
      error: string;
    };

const processorOf = (
  processingSteps: ProcessingStep<any>[],
  settings: Settings
) => {
  if (!processingSteps || processingSteps.length === 0) {
    throw new Error("No functions supplied to image processor");
  }

  const processStep = (
    image: cv.Mat,
    step: ProcessingStep<any>,
    intermediateImages: IntermediateImages
  ): ProcessStepResult => {
    try {
      var settings = settingsFor(step);
      const intermediateImageOf = (stepName: StepName) => {
        return Object.entries(intermediateImages).findLast(
          ([key]) => key === stepName
        )![1];
      };
      return {
        type: "success",
        stepResult: step.process(image, settings, intermediateImageOf),
      };
    } catch (e) {
      const errorMessage =
        "Failed to execute step: " + step.name + ", " + handleOpenCvError(e);
      return {
        type: "error",
        error: errorMessage,
      };
    }
  };

  const settingsFor = (step: ProcessingStep<any>): StepSetting => {
    const name = step.name;
    const stepSettings = { ...step.settings, ...settings[name] };
    return stepSettings;
  };

  const stepData: StepResult[] = [];
  let intermediateImages: IntermediateImages = {};

  const withPreviousSteps = (stepResults: StepResult[]) => {
    intermediateImages = stepResults
      .map((it) => {
        return { [it.stepName]: imageOf(it.imageData, it.imageColorSpace) };
      })
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

    stepResults.forEach((it) => stepData.push(it));
    return result;
  };

  const process = (image: cv.Mat): ProcessingResult => {
    let errorMessage = undefined;
    let currentImage = image;
    for (const step of processingSteps) {
      const result = processStep(currentImage, step, intermediateImages);
      if (result.type == "success") {
        const stepResult = result.stepResult;
        currentImage = stepResult.image;
        stepData.push({
          stepName: step.name,
          imageData: imageDataOf(currentImage),
          imageColorSpace: step.imageColorSpace,
          points: stepResult.points,
        });
        intermediateImages = {
          ...intermediateImages,
          [step.name]: currentImage,
        };
      } else {
        errorMessage = result.error;
        break;
      }
    }

    Object.values(intermediateImages).forEach((it) => it.delete());
    return { results: stepData, error: errorMessage };
  };

  const result = {
    process: process,
    withPreviousSteps: withPreviousSteps,
  };

  return result;
};

export default processorOf;
