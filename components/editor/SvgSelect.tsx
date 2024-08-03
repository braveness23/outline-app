"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import SelectField, { Option } from "../fiields/SelectField";
import { Context } from "@/context/DetailsContext";
import { centerPoints, ContourPoints } from "@/lib/Point";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";

type Props = {
  dictionary: Dictionary;
  onSelect: (ContourPoints: ContourPoints[]) => void;
};

const SvgSelect = ({ dictionary, onSelect }: Props) => {
  const { getAll } = useIndexedDB("details");
  const [items, setItems] = useState<Context[]>();
  const [options, setOptions] = useState<Option[]>();
  const [selected, setSelected] = useState<number>();

  const refreshData = useCallback(() => {
    const asOption = (context: Context): Option => {
      return {
        value: context.id!,
        label: context.details.name,
      };
    };
    getAll().then((allContexts) => {
      if (allContexts && allContexts.length > 0) {
        setItems(allContexts);
        setOptions(allContexts.map(asOption));
        setSelected(allContexts[0].id!);
      }
    });
  }, [getAll]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const contextId = Number.parseInt(event.target.value);
    const selected = items?.find((it) => it.id == contextId);
    if (selected) {
      const paperDimensions = paperDimensionsOfDetailsContext(selected);
      onSelect(
        selected.contours.map((it) => centerPoints(it, paperDimensions))
      );
      setSelected(contextId);
    }
  };

  useEffect(() => refreshData(), []);

  if (!options) {
    return <></>;
  }
  return (
    <>
      <SelectField
        label={"Select Contour"}
        name={"Select Contour"}
        options={options}
        value={selected}
        onChange={onChange}
      ></SelectField>
    </>
  );
};

export default SvgSelect;
