import React from "react";
import { useStoreContext } from "../../context";
import { ControlsRoot, ControlsRootProps } from "./ControlsRoot";

type ControlsPanelProps = Partial<ControlsRootProps>;

// uses custom store
export function ControlsPanel({ store, ...props }: ControlsPanelProps) {
  const parentStore = useStoreContext();
  const _store = store === undefined ? parentStore : store;
  return <ControlsRoot store={_store} {...props} />;
}
