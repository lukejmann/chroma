import { styled as s1 } from "../../styles";
import styled from "styled-components/macro";

export const ImageContainer = s1("div", {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "$sizes$imageRowHeight auto 20px",
  columnGap: "$colGap",
  alignItems: "center",
});

export const DropZone = s1("div", {
  $flexCenter: "",
  overflow: "hidden",
  height: "$rowHeight",
  background: "$econtrolstion3",
  textAlign: "center",
  color: "inherit",
  borderRadius: "$sm",
  outline: "none",
  userSelect: "none",
  cursor: "pointer",
  $inputStyle: "",
  $hover: "",
  $focusWithin: "",
  $active: "$accent1 $econtrolstion1",
  variants: {
    isDragAccept: {
      true: {
        $inputStyle: "$accent1",
        backgroundColor: "$econtrolstion1",
      },
    },
  },
});

export const ImagePreview = s1("div", {
  boxSizing: "border-box",
  borderRadius: "$sm",
  height: "$rowHeight",
  width: "$rowHeight",
  $inputStyle: "",
  backgroundSize: "cover",
  backgroundPosition: "center",
  variants: {
    hasImage: {
      true: { cursor: "pointer", $hover: "", $active: "" },
    },
  },
});

export const Instructions = s1("div", {
  fontSize: "0.8em",
  height: "100%",
  padding: "$rowGap $md",
});

export const Remove = s1("div", {
  $flexCenter: "",
  top: "0",
  right: "0",
  marginRight: "$sm",
  height: "100%",
  cursor: "pointer",

  variants: {
    disabled: {
      true: { color: "$econtrolstion3", cursor: "default" },
    },
  },

  "&::after,&::before": {
    content: '""',
    position: "absolute",
    height: 2,
    width: 10,
    borderRadius: 1,
    backgroundColor: "currentColor",
  },

  "&::after": { transform: "rotate(45deg)" },
  "&::before": { transform: "rotate(-45deg)" },
});
