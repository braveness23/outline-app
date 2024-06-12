import Settings from "@/lib/opencv/Settings";
import InputField from "../fiields/InputField";
import { Dictionary } from "@/app/dictionaries";
import StepName from "@/lib/opencv/steps/StepName";
import { StepSetting } from "@/lib/opencv/steps/ProcessingFunction";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  step?: StepName;
  onChange: (stepSettings: StepSetting) => void;
};

export const AdvancedSettingsEditor = ({
  dictionary,
  settings,
  step,
  onChange,
}: Props) => {
  const [currentSetting, setCurrentSetting] = useState<StepSetting>();

  useEffect(() => {
    if (step) {
      setCurrentSetting(settings[step]);
    }
  }, [settings, step]);

  if (!step) {
    return null;
  }

  const handleOnChange = (key: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...currentSetting,
        [key]: Number.parseInt(event.target.value),
      };
      setCurrentSetting(updatedSetting);
      onChange(updatedSetting);
    };
  };

  const settingLabel = (key: string) => {
    //@ts-ignore
    return dictionary.calibration.stepSettings[key];
  };

  return (
    <div>
      <h2 className="text-center p-2">{dictionary.calibration.settings}</h2>
      {currentSetting &&
        Object.keys(currentSetting).map((key) => {
          return (
            <InputField
              key={key}
              label={settingLabel(key)}
              name={`${key}`}
              value={currentSetting[key]}
              onChange={handleOnChange(key)}
              type="number"
            />
          );
        })}
    </div>
  );
};
