"use client";

import { ReplicadResult } from "@/lib/replicad/Worker";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  message?: any;
  onWorkerMessage: (result: ReplicadResult) => void;
  onError?: (message: string) => void;
};

export const ReplicadWorker = ({
  message,
  onWorkerMessage,
  onError,
}: Props) => {
  const workerRef = useRef<Worker>();

  const handleMessage = useCallback(
    (event: MessageEvent<ReplicadResult>) => {
      const result = event.data as ReplicadResult;
      onWorkerMessage(result);
    },
    [onWorkerMessage, onError]
  );

  const addMessageHandler = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = handleMessage;
    }
  }, [handleMessage]);

  const postWork = useCallback(() => {
    if (workerRef.current && message) {
      workerRef.current?.postMessage(message);
    }
  }, [message]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/replicad/Worker.ts", import.meta.url)
    );
    addMessageHandler();
    postWork();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    postWork();
  }, [postWork]);

  return <></>;
};
