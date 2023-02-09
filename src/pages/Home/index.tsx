import { AutoColumn } from "components/Column";
import { folder, useControls } from "components/controls";
// import { useControls } from "leva";
// import { useControls } from "controls";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowRight } from "react-feather";
import { NavLink } from "react-router-dom";
import { Text } from "rebass";
import { useIsDarkMode } from "state/user/hooks";
import styled from "styled-components/macro";
import { IconWrapper } from "theme";
import { proxy, useSnapshot, subscribe } from "valtio";
import {
  canvasStore,
  RGBADatapoint,
  settingsStore,
  ThreeCanvas,
} from "./Three";

export const TextStandard = styled(Text)`
  font-family: "Satoshi", sans-serif;
  color: ${({ theme }) => theme.black};
  font-size: 12px;
  font-weight: 500;
`;
export const TextBold = styled(TextStandard)`
  font-weight: 900;
`;
export const TextLight = styled(TextStandard)`
  font-weight: 400;
`;

export const PageWrapper = styled.main<{ margin?: string; maxWidth?: string }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? "0px"};
  max-width: ${({ maxWidth }) => maxWidth ?? "510px"};
  width: 100%;
  margin-top: 1rem;
  // margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 940px;
  height: 426px;
  z-index: 1;
`;

// const TwoColumnWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
//   justify-content: space-between;
//   gap: 1rem;
//   width: 100%;
//   height: 100%;
//   background-color: ${({ theme }) => theme.bg4};
// `;

enum UploadStatus {
  Empty,
  Hovered,
  Uploading,
  Uploaded,
}

const UploadArea = styled.div<{ status: UploadStatus }>`
  display: flex;
  flex-direction: column;
  align-items: center
  justify-content: center;
  height: 100%;
  width: 450px !important;
  min-width: 450px !important;
  border: 2px dashed ${({ theme }) => theme.text5};
  border-radius: 21px;
  background-color: ${({ theme }) => theme.bg2};
  cursor: ${({ status }) =>
    status === UploadStatus.Empty ? "pointer" : "default"};
  &:hover {
    border: 2px dashed ${({ theme }) => theme.text1};
  }
  // padding: 1rem;
`;

const ImagePreview = styled.img`
  // should scale max width to 100% of parent
  // keep aspect ratio
  max-width: 100%;
  max-height: 300px;
  // max-height: 100%;
  max-width: 300px;
  object-fit: contain;

  border-radius: 18px;
`;

const ThreeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 21px;
  overflow: hidden;
`;

interface ImageData {
  id: string;
  file: File;
}

export const useUploader = () => {
  const [items, setItems] = useState<FileList | null>(null);
  const [images, setImages] = useState<ImageData[] | null>(null);

  const reset = useCallback(() => {
    setItems(null);
    setImages(null);
  }, []);

  useEffect(() => {
    const run = async () => {
      // e.preventDefault();
      // e.stopPropagation();
      // const items = e.dataTransfer.items;
      // console.log('items length', items.length);
      // const files: string[] = [];

      if (!items) {
        return;
      }

      const traverseUpload = async (item: any, path?: string) => {
        path = path || "";
        const files: { name: string; file: any }[] = [];
        let done = false;
        if (item.isFile) {
          const fileRes0 = await item.file(function (file: any) {
            console.log("file", file);
            files.push({ name: path + file.name, file });
            done = true;
          });
          // console.log('fileRes0', fileRes0);
        } else if (item.isDirectory) {
          var dirReader = item.createReader();
          const readRes = await dirReader.readEntries(async function (
            entries: any
          ) {
            for (var i = 0; i < entries.length; i++) {
              const newFiles = await traverseUpload(
                entries[i],
                path + item.name + "/"
              );
              files.push(...(newFiles as { name: string; file: any }[]));
            }
            done = true;
          });
          // console.log('readRes', readRes);
        }
        const returnWhenDone = new Promise((resolve) => {
          const interval = setInterval(() => {
            if (done) {
              clearInterval(interval);
              resolve(files);
            }
          }, 10);
        });
        return returnWhenDone;
      };
    };
    run();
  }, [items]);

  return {
    setItems,
    // beginUpload,
    images,
  };
};

const chromaStore = proxy({
  uploadStatus: UploadStatus.Empty,
  images: [] as ImageData[],
});

export default function Home() {
  return <ThreeCanvas />;
  return (
    <>
      <PageWrapper>
        {/* <TwoColumnWrapper> */}
        {/* <UploadArea
          status={chromaStore.uploadStatus}
          // onDrop={handleDrop}
          // // onDropCapture={handleDrop}
          // onDragOver={handleDragOver}
          {...getRootProps({ refKey: "innerRef" })}
        >
          <input {...getInputProps()} />
          {image == undefined ? (
            <AutoColumn>
              <div>Drag and drop files here</div>
              <div>or</div>
              <div>click to select files</div>
            </AutoColumn>
          ) : (
            <AutoColumn>
              <ImagePreview
                onLoad={() => setLoaded(true)}
                ref={imageRef}
                src={(imageToUse as any).preview}
              />
            </AutoColumn>
          )}
        </UploadArea> */}
        {/* <GhostCanvasWrapper */}

        {/* <div></div> */}
        {/* </TwoColumnWrapper> */}
      </PageWrapper>
      <ThreeCanvas></ThreeCanvas>
    </>
  );
}

interface GhostCanvasProps {
  imageSrc?: string;
}

const GhostCanvasWrapper = styled.div`
  z-index: -1;
  visibility: hidden;
`;

export function GhostCanvas({ imageSrc }: GhostCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onLoad = useCallback(() => {
    console.log("image loaded 2");
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("no canvas");
      return;
    }
    if (!image) {
      console.log("no image");
      return;
    }
    canvas.height = image.naturalHeight || image.offsetHeight || image.height;
    canvas.width = image.naturalWidth || image.offsetWidth || image.width;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      console.log("no ctx");
      return;
    }
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    // console.log("data", data);
    const rgbaData: RGBADatapoint[] = [];
    // if data.length > 12000, then we select 3000 random points
    const numPoints = data.length / 4;
    const numPointsToSample = Math.min(3000, numPoints);
    // must be multiple of 4
    const stepSize =
      Math.floor(numPoints / numPointsToSample) -
      (Math.floor(numPoints / numPointsToSample) % 4);
    // console.log("stepSize", stepSize);
    for (let i = 0; i < numPoints; i += stepSize) {
      const index = i * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      rgbaData.push({ r, g, b, a });
    }
    canvasStore.rgbaDatas = rgbaData;
    console.log("rgbaData", rgbaData);
  }, [imageSrc]);

  // console.log("loaded", loaded);

  // useEffect(() => {
  //   console.log("image changed");
  //   if (!image) {
  //     return;
  //   }
  //   if (loaded && image.complete) {
  //     onLoad();
  //   }
  // }, [image?.complete, loaded]);

  return (
    <GhostCanvasWrapper>
      <img onLoad={onLoad} src={imageSrc} ref={imageRef} />
      <canvas ref={canvasRef} />
    </GhostCanvasWrapper>
  );
}
