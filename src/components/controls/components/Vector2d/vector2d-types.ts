import type { ControlsInputProps, Vector2d, VectorObj } from "../../types";
import type { InternalVectorSettings } from "../Vector/vector-types";

export type InternalVector2dSettings = InternalVectorSettings<
  string,
  [string, string]
> & {
  joystick: boolean | "invertY";
};
export type Vector2dProps = ControlsInputProps<
  Vector2d,
  InternalVector2dSettings,
  VectorObj
>;
