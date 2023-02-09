import { register } from "./plugin";
import number from "./components/Number";
import select from "./components/Select";
import color from "./components/Color";
import string from "./components/String";
import boolean from "./components/Boolean";
import vector3d from "./components/Vector3d";
import vector2d from "./components/Vector2d";
import image from "./components/Image";
import interval from "./components/Interval";
import { ControlsInputs } from "./types";

/**
 * Register all the primitive inputs.
 * @note could potentially be done elsewhere.
 */

register(ControlsInputs.SELECT, select);
register(ControlsInputs.IMAGE, image);
register(ControlsInputs.NUMBER, number);
register(ControlsInputs.COLOR, color);
register(ControlsInputs.STRING, string);
register(ControlsInputs.BOOLEAN, boolean);
register(ControlsInputs.INTERVAL, interval);
register(ControlsInputs.VECTOR3D, vector3d);
register(ControlsInputs.VECTOR2D, vector2d);

// main hook
export { useControls } from "./useControls";

// panel components
export { Controls, ControlsPanel } from "./components/Controls";

// simplifies passing store as context
export { useStoreContext, ControlsStoreProvider } from "./context";

// export the controlsStore (default store)
// hook to create custom store
export { controlsStore, useCreateStore } from "./store";

// export folder, monitor, button
export * from "./helpers";

export { ControlsInputs };
