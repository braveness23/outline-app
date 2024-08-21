"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/ModelData";
import React, { useEffect, useState } from "react";
import ContourMesh from "./threejs/ContourMesh";
import { ContourPoints, scalePoints } from "@/lib/Point";
import ContourIndex from "./ContourIndex";
import { Select } from "@react-three/drei";
import { useEditorContext } from "../../EditorContext";
import EditorHistoryType from "../../EditorHistoryType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: (data: ModelData, type: EditorHistoryType) => void;
};

const ContourModeEdit = ({
  dictionary,
  modelData,
  setModelData
}: Props) => {
  const scale = 0.01;

  const {selectedId, selectedPoint, setSelectedPoint, setDisableCamera} = useEditorContext();

  const [scaledContours, setScaledContours] = useState<ContourPoints[]>([]);


  useEffect(() => {
    const data = modelData.items.find((it) => it.id == selectedId);
    if (data?.type == "shadow") {
      const scaledPoints = data.points.map((it) => scalePoints(it, scale));
      setScaledContours(scaledPoints);
    } else {
      throw new Error("Can't edit non shadows objects!");
    }
  }, [modelData, selectedId]);

  const updateModelData = (contourPoints: ContourPoints[]) => {
    const updatedPoints = contourPoints.map((it) => scalePoints(it, 1 / scale));
    const updatedData = {
      items: modelData.items.map((it) => {
        if (it.id == selectedId && it.type == "shadow") {
          return { ...it, points: updatedPoints };
        }
        return it;
      }),
    };
    setModelData(updatedData, EditorHistoryType.OBJ_UPDATED);
  };

  const onContourChanged = (contourIndex: number) => {
    return (contour: ContourPoints) => {
      const updatedContours = [...scaledContours];
      updatedContours[contourIndex] = contour;
      updateModelData(updatedContours);
    };
  };

  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      const point = obj[0];
      const pointIndex = point.userData?.contourIndex as ContourIndex;
      if (pointIndex) {
        setSelectedPoint(pointIndex);
      }
    }
  };

  return (
    <>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        {scaledContours &&
          scaledContours.map((contour, index) => {
            return (
              <ContourMesh
                key={"ContourMesh" + index}
                contourIndex={index}
                contour={contour}
                onContourChange={onContourChanged(index)}
                selectedPoint={selectedPoint}
                onPointMoveStart={() => setDisableCamera(true)}
                onPointMoveEnd={() => setDisableCamera(false)}
              ></ContourMesh>
            );
          })}
      </Select>
    </>
  );
};

export default ContourModeEdit;
