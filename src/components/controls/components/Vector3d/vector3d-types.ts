import type { ControlsInputProps, Vector3d, VectorObj } from "../../types";
import type { InternalVectorSettings } from "../Vector/vector-types";

export type InternalVector3dSettings = InternalVectorSettings<
  string,
  [string, string, string]
>;
export type Vector3dProps = ControlsInputProps<
  Vector3d,
  InternalVector3dSettings,
  VectorObj
>;
