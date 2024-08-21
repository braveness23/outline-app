import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../../EditorMode";
import ContourModeEdit from "./ContourModeEdit";
import ContourModeToolbar from "./ContourModeToolbar";
import { ModelData } from "@/lib/replicad/ModelData";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: (data: ModelData) => void;
};

const ContourMode = ({
  dictionary,
  modelData,
  setModelData
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ContourModeEdit
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></ContourModeEdit>
      );
    },
    toolbar: () => {
      return (
        <ContourModeToolbar
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></ContourModeToolbar>
      );
    },
  };
  return mode;
};

export default ContourMode;
