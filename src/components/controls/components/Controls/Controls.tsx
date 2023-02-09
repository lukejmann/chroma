import React, { useEffect } from "react";
import { controlsStore } from "../../store";
import { ControlsRoot, ControlsRootProps } from "./ControlsRoot";
import { render } from "../../utils/react";

let rootInitialized = false;
let rootEl: HTMLElement | null = null;

type ControlsProps = Omit<Partial<ControlsRootProps>, "store"> & {
  isRoot?: boolean;
};

// uses global store
export function Controls({ isRoot = false, ...props }: ControlsProps) {
  useEffect(() => {
    rootInitialized = true;
    // if this panel was attached somewhere in the app and there is already
    // a floating panel, we remove it.
    if (!isRoot && rootEl) {
      rootEl.remove();
      rootEl = null;
    }
    return () => {
      if (!isRoot) rootInitialized = false;
    };
  }, [isRoot]);

  return <ControlsRoot store={controlsStore} {...props} />;
}

/**
 * This hook is used by Controls useControls, and ensures that we spawn a Controls Panel
 * without the user having to put it into the component tree. This should only
 * happen when using the global store
 * @param isGlobalPanel
 */
export function useRenderRoot(isGlobalPanel: boolean) {
  useEffect(() => {
    if (isGlobalPanel && !rootInitialized) {
      if (!rootEl) {
        rootEl =
          document.getElementById("controls__root") ||
          Object.assign(document.createElement("div"), {
            id: "controls__root",
          });
        if (document.body) {
          document.body.appendChild(rootEl);
          render(<Controls isRoot />, rootEl);
        }
      }
      rootInitialized = true;
    }
  }, [isGlobalPanel]);
}
