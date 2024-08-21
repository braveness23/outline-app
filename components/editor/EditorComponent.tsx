"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import { Object3D, Vector3 } from "three";
import ThreeJsEnvironment from "./ThreeJsEnvironment";
import WireframeButton from "./ui/WireframeButton";
import EditorMode from "./EditorMode";
import ResultMode from "./mode/result/ResultMode";
import EditMode from "./mode/edit/EditMode";
import ContourMode from "./mode/contour/ContourMode";
import { ModelData } from "@/lib/replicad/ModelData";
import ModelName from "./ui/ModelName";
import { useEditorContext } from "./EditorContext";
import RenderButton from "./ui/RenderButton";
import { useModelContext } from "./ModelContext";
import SaveModel from "./ui/SaveModel";

type Props = {
  dictionary: Dictionary;
};

const EditorComponent = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const { editorMode } = useEditorContext();
  const { model, setModel } = useModelContext();

  const setModelData = (modelData: ModelData) => {
    setModel((prev) => {
      return { ...prev, modelData: modelData };
    });
  };

  const editMode = EditMode({
    dictionary,
    modelData: model.modelData,
    setModelData,
  });
  const resultMode = ResultMode({
    dictionary,
    modelData: model.modelData,
  });

  const contourMode = ContourMode({
    dictionary,
    modelData: model.modelData,
    setModelData,
  });

  const editorModes = {
    [EditorMode.EDIT]: editMode,
    [EditorMode.RESULT]: resultMode,
    [EditorMode.CONTOUR_EDIT]: contourMode,
  };

  const currentEditorMode = editorModes[editorMode];

  return (
    <>
      <ModelName dictionary={dictionary}></ModelName>
      <div className="flex flex-col xl:flex-row gap-2">
        <div className="w-full xl:w-1/2">
          <div className="w-full h-[60vh]">
            <div className="z-10 relative">
              <WireframeButton></WireframeButton>
            </div>
            <ThreeJsEnvironment dictionary={dictionary}>
              {currentEditorMode ? currentEditorMode.view() : null}
            </ThreeJsEnvironment>
          </div>
          <div className="flex flex-row gap-2">
            <RenderButton dictionary={dictionary}></RenderButton>
            <SaveModel dictionary={dictionary}></SaveModel>
          </div>
        </div>

        <div className="w-full xl:w-1/2">
          {currentEditorMode ? currentEditorMode.toolbar() : null}
        </div>
      </div>
    </>
  );
};

export default EditorComponent;
