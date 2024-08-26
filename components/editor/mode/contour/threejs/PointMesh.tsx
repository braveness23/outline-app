import React, {
  memo,
  useRef,
} from "react";
import { Vector3 } from "three";
import ContourIndex from "../ContourIndex";
import { POINT_SCALE_THREEJS, scaleVectorOf } from "@/lib/point/Point";
import pointShaderMaterialOf from "./PointShader";
import { useThree } from "@react-three/fiber";

type Props = {
  transparent: boolean;
  index: number;
  contourIndex: number;
  color: "red" | "black";
  size: number;
};

const PointMesh = memo(function PointMesh({
  contourIndex,
  index,
  color,
  transparent,
  size = 1,
}: Props) {
  const { invalidate } = useThree();
  const circleRef = useRef<any>();
  const materialRef = useRef<any>();

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  const alpha = transparent ? 0 : 0.3;

  return (
    <group
      position={new Vector3(0, 0, 0.0001)}
      userData={{ contourIndex: asContourIndex() }}
    >
      <mesh
        ref={circleRef}
        scale={scaleVectorOf(POINT_SCALE_THREEJS)}
        userData={{ contourIndex: asContourIndex() }}
      >
        <circleGeometry args={[size]}></circleGeometry>
        <shaderMaterial
          ref={materialRef}
          attach="material"
          {...pointShaderMaterialOf(size, color, alpha)}
        />
      </mesh>
    </group>
  );
});

export default PointMesh;
