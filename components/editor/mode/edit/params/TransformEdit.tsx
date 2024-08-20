"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { Item } from "@/lib/replicad/Model";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
};

const TransformEdit = ({ dictionary, item, onItemChange }: Props) => {

  const handleTranslationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedTranslation = { ...item.translation!, [name]: value };
      const updatedParams = { ...item, translation: updatedTranslation };
      onItemChange(updatedParams);
    };
  };

  const handleRotationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedRotation = { ...item.rotation!, [name]: value };
      const updatedParams = { ...item, rotation: updatedRotation };
      onItemChange(updatedParams);
    };
  };

  return (
    <>
      <NumberField
        value={item.translation!.x}
        onChange={handleTranslationChange("x")}
        label={"X"}
        name={"x"}
      ></NumberField>
      <NumberField
        value={item.translation!.y}
        onChange={handleTranslationChange("y")}
        label={"Y"}
        name={"y"}
      ></NumberField>
      <NumberField
        value={item.translation!.z}
        onChange={handleTranslationChange("z")}
        label={"Z"}
        name={"z"}
      ></NumberField>
      <NumberField
        value={item.rotation!.x}
        onChange={handleRotationChange("x")}
        label={"Rotation X"}
        name={"rotationX"}
      ></NumberField>
      <NumberField
        value={item.rotation!.y}
        onChange={handleRotationChange("y")}
        label={"Rotation Y"}
        name={"rotationY"}
      ></NumberField>
      <NumberField
        value={item.rotation!.z}
        onChange={handleRotationChange("z")}
        label={"Rotation Z"}
        name={"rotationZ"}
      ></NumberField>
    </>
  );
};

export default TransformEdit;
