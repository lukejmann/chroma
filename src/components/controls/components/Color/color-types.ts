import type {
  ColorVectorInput,
  InputWithSettings,
  ControlsInputProps,
} from "../../types";

export type Format = "hex" | "rgb" | "hsl" | "hsv";

export type Color = string | ColorVectorInput;
export type InternalColorSettings = {
  format: Format;
  hasAlpha: boolean;
  isString: boolean;
};

export type ColorInput = InputWithSettings<Color>;

export type ColorProps = ControlsInputProps<
  Color,
  InternalColorSettings,
  string
>;
