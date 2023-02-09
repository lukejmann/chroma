import type { InputWithSettings, ControlsInputProps } from "../../types";

export type StringSettings = { editable?: boolean; rows?: boolean | number };
export type InternalStringSettings = { editable: boolean; rows: number };
export type StringInput = InputWithSettings<string, StringSettings>;
export type StringProps = ControlsInputProps<string, InternalStringSettings>;
