import { createStitches } from "@stitches/react";
import { useTheme } from "styled-components/macro";
import { colors } from "theme";
import { transparentize } from "polished";

export const getDefaultTheme = () => {
  // const theme = darkm
  const c = colors(false);
  return {
    colors: {
      econtrolstion1: transparentize(0.1, c.bg1), // bg color of the folders
      econtrolstion2: c.bg1, // bg color of the rows (main panel color)
      econtrolstion3: c.bg2, // bg color of the inputs
      accent1: c.primary1,
      accent2: c.primary2,
      accent3: c.primary4,
      highlight1: c.text3,
      highlight2: c.text2,
      highlight3: c.text1,
      vivid1: c.yellow1,
      folderWidgetColor: "$highlight2",
      folderTextColor: "$highlight3",
      toolTipBackground: "$highlight3",
      toolTipText: "$econtrolstion2",
    },
    radii: {
      xs: "6px",
      sm: "8px",
      lg: "12px",
    },
    space: {
      xs: "3px",
      sm: "6px",
      md: "10px",
      rowGap: "7px",
      colGap: "7px",
    },
    fonts: {
      mono: `ui-mono, SFMono-Regular, Menlo, 'Roboto Mono', monospace`,
      sans: `Satoshi, sans-serif`,
    },
    fontSizes: {
      root: "12px",
      toolTip: "$root",
    },
    sizes: {
      rootWidth: "280px",
      controlWidth: "160px",
      numberInputMinWidth: "38px",
      scrubberWidth: "8px",
      scrubberHeight: "16px",
      rowHeight: "24px",
      imageRowHeight: "200px",
      folderTitleHeight: "20px",
      checkboxSize: "16px",
      joystickWidth: "100px",
      joystickHeight: "100px",
      colorPickerWidth: "$controlWidth",
      colorPickerHeight: "100px",
      imagePreviewWidth: "$controlWidth",
      imagePreviewHeight: "300px",
      monitorHeight: "60px",
      titleBarHeight: "39px",
    },
    shadows: {
      level1: "0 4px 12px 0 rgba(0,0,0,0.2)",
      level2: "0 4px 14px #00000033",
    },
    borderWidths: {
      root: "0px",
      input: "1px",
      focus: "1px",
      hover: "1px",
      active: "1px",
      folder: "1px",
    },
    fontWeights: {
      label: "normal",
      folder: "normal",
      button: "normal",
    },
  };
};

export type FullTheme = ReturnType<typeof getDefaultTheme>;
export type ControlsCustomTheme = Partial<{
  [k in keyof FullTheme]: Partial<FullTheme[k]>;
}>;

type Options = {
  key: string;
  borderColor: string;
  backgroundColor?: string;
  inset?: boolean;
};

function createStateClass(value: string, options: Options) {
  const [borderColor, bgColor] = value.split(" ");
  const css: any = {};
  if (borderColor !== "none") {
    css.boxShadow = `${options.inset ? "inset " : ""}0 0 0 $borderWidths${[
      options.key,
    ]} $colors${
      (borderColor !== "default" && borderColor) || options.borderColor
    }`;
  }

  if (bgColor) {
    css.backgroundColor = bgColor;
  }

  return css;
}

const utils = {
  $inputStyle: () => (value: string) =>
    createStateClass(value, {
      key: "$input",
      borderColor: "$highlight1",
      inset: true,
    }),
  $focusStyle: () => (value: string) =>
    createStateClass(value, { key: "$focus", borderColor: "$accent2" }),
  $hoverStyle: () => (value: string) =>
    createStateClass(value, {
      key: "$hover",
      borderColor: "$accent1",
      inset: true,
    }),
  $activeStyle: () => (value: string) =>
    createStateClass(value, {
      key: "$active",
      borderColor: "$accent1",
      inset: true,
    }),
};

export const { styled, css, createTheme, globalCss, keyframes } =
  createStitches({
    prefix: "controls",
    theme: getDefaultTheme(),
    utils: {
      // ...prefixes,
      ...utils,
      $flex: () => ({
        display: "flex",
        alignItems: "center",
      }),
      $flexCenter: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
      $reset: () => ({
        outline: "none",
        fontSize: "inherit",
        fontWeight: "inherit",
        color: "inherit",
        fontFamily: "inherit",
        border: "none",
        backgroundColor: "transparent",
        appearance: "none",
      }),
      $draggable: () => ({
        touchAction: "none",
        WebkitUserDrag: "none",
        userSelect: "none",
      }),
      $focus: (value: string) => ({ "&:focus": utils.$focusStyle()(value) }),
      $focusWithin: (value: string) => ({
        "&:focus-within": utils.$focusStyle()(value),
      }),
      $hover: (value: string) => ({ "&:hover": utils.$hoverStyle()(value) }),
      $active: (value: string) => ({ "&:active": utils.$activeStyle()(value) }),
    },
  });

export const globalStyles = globalCss({
  ".controls__panel__dragged": {
    WebkitUserDrag: "none",
    userSelect: "none",
    input: { userSelect: "none" },
    "*": { cursor: "ew-resize !important" },
  },
});
