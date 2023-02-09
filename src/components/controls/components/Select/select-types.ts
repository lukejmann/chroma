import type { ControlsInputProps } from "../../types";

export type SelectSettings<U = unknown> = { options: Record<string, U> | U[] };
export type InternalSelectSettings = { keys: string[]; values: any[] };

export type SelectInput<P = unknown, U = unknown> = {
  value?: P;
} & SelectSettings<U>;

export type SelectProps = ControlsInputProps<
  any,
  InternalSelectSettings,
  number
>;
