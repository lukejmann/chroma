import React, { useCallback } from "react";
import { Label, Portal, Overlay, Row } from "../UI";
import { useDropzone } from "react-dropzone";
import {
  DropZone,
  // ImageContainer,
  ImagePreview,
  Instructions,
  Remove,
} from "./StyledImage";
import { useInputContext } from "../../context";
import { usePopin } from "../../hooks";
import type { ImageProps } from "./image-types";
import { StyledRow } from "../UI/StyledUI";
import { styled as s1 } from "components/controls/styles";
import styled from "styled-components/macro";

export const StyledImageRowRow = s1(StyledRow, {
  gridTemplateColumns: "auto 1fr 10px",
  gridTemplateRows: "minmax($sizes$imageRowHeight, auto)",
  columnGap: "$colGap",
  maxWidth: "$maxWidth",
  minWidth: "$maxWidth",
});

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  background-color: $colors$gray200;
`;

export const UploadArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center
  justify-content: space-between;
  // height: 100%;
  // width: 100%;
  // width: 450px !important;
  min-width: 100% !important;
  border: 2px dashed ${({ theme }) => theme.text5};
  border-radius: 21px;
  background-color: ${({ theme }) => theme.bg2};
  &:hover {
    border: 2px dashed ${({ theme }) => theme.text1};
    cursor: pointer;
  }
  overflow: hidden;
`;

export const ImageLargePreview = s1("div", {
  // $flexCenter: "",
  width: "300px",

  height: "$imagePreviewHeight",
  borderRadius: "$sm",
  boxShadow: "$level2",
  pointerEvents: "none",
  $inputStyle: "",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
});

// const ImageLargePreview = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center
//   justify-content: center;
//   height: 100%;
//   width: 100%;
//   // width: 450px !important;
//   min-width: 100% !important;
//   border: 2px dashed ${({ theme }) => theme.text5};
//   border-radius: 21px;
//   background-color: ${({ theme }) => theme.bg2};
//   &:hover {
//     border: 2px dashed ${({ theme }) => theme.text1};
//     cursor: pointer;
//   }
// `;

export function ImageComponent() {
  const { label, value, onUpdate, disabled } = useInputContext<ImageProps>();
  const { popinRef, wrapperRef, shown, show, hide } = usePopin();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length) onUpdate(acceptedFiles[0]);
    },
    [onUpdate]
  );

  const clear = useCallback(
    (e) => {
      e.stopPropagation();
      onUpdate(undefined);
    },
    [onUpdate]
  );

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    maxFiles: 1,
    accept: { "image/*": [] },
    onDrop,
    disabled,
  });

  // TODO fix any in DropZone
  return (
    <ImageContainer>
      {/* <ImageContainer> */}

      <UploadArea {...(getRootProps({ isDragAccept }) as any)}>
        <input {...getInputProps()} />
        {!value ? (
          <Instructions>
            {isDragAccept
              ? "Drag and drop or click to upload"
              : "Click to upload"}
          </Instructions>
        ) : (
          <ImageLargePreview
            ref={wrapperRef}
            style={{ backgroundImage: `url(${value})` }}
          />
        )}
      </UploadArea>

      {/* {shown && !!value && (
        <Portal>
          <Overlay onPointerUp={hide} style={{ cursor: "pointer" }} />
          <ImageLargePreview
            ref={wrapperRef}
            style={{ backgroundImage: `url(${value})` }}
          />
        </Portal>
      )} */}

      {/* <Remove onClick={clear} disabled={!value} /> */}
      {/* </ImageContainer> */}
    </ImageContainer>
  );
}
