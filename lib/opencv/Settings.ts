import { processingFunctions } from "./ImageProcessor";
import { StepSetting } from "./steps/ProcessingFunction";

type Settings = {
  [key: string]: StepSetting;
  paperSettings: PaperSettings;
};

type PaperSettings = {
  width: number;
  height: number;
};

export const defaultSettings = (): Settings => {
  let settings = {};
  for (const step of processingFunctions) {
    settings = { ...settings, [step.name]: step.settings };
  }
  return settings as Settings;
};

export default Settings;
