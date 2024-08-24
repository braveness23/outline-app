"use client";

import { Dictionary } from "@/app/dictionaries";
import ModelData from "@/lib/replicad/model/ModelData";
import React, { useEffect, useMemo, useState } from "react";
import ReplicadMesh from "../../replicad/ReplicadMesh";
import newWorkerInstance from "../../replicad/ReplicadWorker";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import { useModelDataContext } from "../../ModelDataContext";

type Props = {
  dictionary: Dictionary;
};

const ResultViewer = ({ dictionary }: Props) => {
  const {modelData } = useModelDataContext();

  const [modelResult, setModelResult] = useState<ReplicadResult>();
  const { wireframe } = useEditorContext();

  useEffect(() => {
    const { api, worker } = newWorkerInstance();
    api.processModelData(modelData).then(
      (result) => {
        setModelResult(result as ReplicadResult);
        worker.terminate();
      },
      (error) => {
        console.error(error);
      }
    );
  }, [modelData]);

  return (
    <>
      {modelResult && (
        <ReplicadMesh
          faces={modelResult.faces}
          edges={modelResult.edges}
          wireframe={wireframe}
          opacity={1}
          color="#5a8296"
        ></ReplicadMesh>
      )}
    </>
  );
};

export default ResultViewer;
