import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RGBELoader } from "three-stdlib";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Instances,
  Instance,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Text3D,
  Center,
  useFBO,
  MeshTransmissionMaterial,
  Edges,
  GizmoHelper,
  GizmoViewcube,
  ContactShadows,
  TransformControls,
  useCursor,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import styled, { useTheme } from "styled-components/macro";
import { MathUtils, MeshBasicMaterial, Vector3 } from "three";
import {
  ControlsPanel,
  folder,
  useControls,
  useCreateStore,
} from "components/controls";
import { transparentize } from "polished";

const RGBToHSB = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0
      ? 0
      : n && v === r
      ? (g - b) / n
      : v === g
      ? 2 + (b - r) / n
      : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

const HSBToRGB = (h: number, s: number, b: number) => {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

function hslToHex(h: number, s: number, l: number) {
  console.log(`hslToHex(${h}, ${s}, ${l})`);
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
export interface RGBADatapoint {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSBDatapoint {
  h: number;
  s: number;
  b: number;
}

interface Dot {
  size: number;
  colorRgb: string;
  hue: number;
  saturation: number;
  brightness: number;
}

// the purpose of this component is to update the dots in the scene based on rgba data
// rgba data should be reduced to a set of colors that are used to create the dots
// first we convert each rgba datapoint from rgba to hsb
// the clusters are then calculated based on the hsb values
// we create clusters based on the hue, saturation, and brightness values (hue*hueWeight + saturation*saturationWeight + brightness*brightnessWeight)
// these clusters are then used to create the dots

const DotsUpdater = ({}: {}) => {
  const { rgbaDatas } = useSnapshot(canvasStore);
  //   first we convert each rgba datapoint from rgba to hsb
  useEffect(() => {
    const hsbDatas = rgbaDatas.map((rgbaData) => {
      const { r, g, b: blue } = rgbaData;
      const [h, s, b] = RGBToHSB(r, g, blue);
      return { h, s, b };
    });
    canvasStore.hsbDatas = hsbDatas;
  }, [rgbaDatas]);

  //   the clusters are then calculated based on the hsb values
  //   we create clusters based on the hue, saturation, and brightness values (hue*hueWeight + saturation*saturationWeight + brightness*brightnessWeight)

  //   size should be proportional to the number of pixels in the cluster
  //   color should be the average of the colors in the cluster

  const { hsbDatas } = useSnapshot(canvasStore);
  const {
    maxColors,
    ignoreColor,
    ignoreHueDifference,
    ignoreSaturationDifference,
    ignoreBrightnessDifference,
    hueWeight,
    saturationWeight,
    brightnessWeight,
  } = useSnapshot(settingsStore);
  useEffect(() => {
    const totalPixels = hsbDatas.length;
    // using k-means clustering

    const { r: rIgnore, g: gIgnore, b: bIgnore } = { ...ignoreColor };
    const [ignoreHue, ignoreSaturation, ignoreBrightness] = RGBToHSB(
      rIgnore,
      gIgnore,
      bIgnore
    );

    // remove colors that are too similar to the ignore color
    const hsbDatasFiltered = hsbDatas.filter((hsbData) => {
      const { h, s, b: b2 } = hsbData;
      const hueDifference = Math.abs(h - ignoreHue);
      const saturationDifference = Math.abs(s - ignoreSaturation);
      const brightnessDifference = Math.abs(b2 - ignoreBrightness);
      return (
        hueDifference > ignoreHueDifference ||
        saturationDifference > ignoreSaturationDifference ||
        brightnessDifference > ignoreBrightnessDifference
      );
    });

    const clusters = hsbDatasFiltered.reduce((acc, hsbData) => {
      const { h, s, b } = hsbData;
      const hue = h * hueWeight;
      const saturation = s * saturationWeight;
      const brightness = b * brightnessWeight;
      const clusterIndex = acc.findIndex(
        (cluster) =>
          Math.abs(cluster.hue - hue) < 10 &&
          Math.abs(cluster.saturation - saturation) < 10 &&
          Math.abs(cluster.brightness - brightness) < 10
      );
      if (clusterIndex === -1) {
        acc.push({
          hue,
          saturation,
          brightness,
          pixels: [hsbData],
        });
      } else {
        acc[clusterIndex].pixels.push(hsbData);
      }
      return acc;
    }, [] as { hue: number; saturation: number; brightness: number; pixels: HSBDatapoint[] }[]);
    // sort clusters by size
    clusters.sort((a, b) => b.pixels.length - a.pixels.length);
    // remove clusters that are too small
    const clustersFiltered = clusters.filter(
      (cluster) => cluster.pixels.length / totalPixels > 0.01
    );
    // remove clusters that are too similar
    const clustersFiltered2 = clustersFiltered.reduce((acc, cluster) => {
      const { hue, saturation, brightness } = cluster;
      const clusterIndex = acc.findIndex(
        (cluster) =>
          Math.abs(cluster.hue - hue) < 10 &&
          Math.abs(cluster.saturation - saturation) < 10 &&
          Math.abs(cluster.brightness - brightness) < 10
      );
      if (clusterIndex === -1) {
        acc.push(cluster);
      }
      return acc;
    }, [] as { hue: number; saturation: number; brightness: number; pixels: HSBDatapoint[] }[]);
    // remove clusters that are too similar
    const clustersFiltered3 = clustersFiltered2.reduce((acc, cluster) => {
      const { hue, saturation, brightness } = cluster;
      const clusterIndex = acc.findIndex(
        (cluster) =>
          Math.abs(cluster.hue - hue) < 10 &&
          Math.abs(cluster.saturation - saturation) < 10 &&
          Math.abs(cluster.brightness - brightness) < 10
      );
      if (clusterIndex === -1) {
        acc.push(cluster);
      }
      return acc;
    }, [] as { hue: number; saturation: number; brightness: number; pixels: HSBDatapoint[] }[]);

    const dots = clustersFiltered3.map((cluster) => {
      const { hue, saturation, brightness, pixels } = cluster;
      const size = pixels.length;
      const colorRgb = hslToHex(hue, saturation, brightness);
      return { size, colorRgb, hue, saturation, brightness };
    });

    // remove ignoreColor

    canvasStore.dots = dots;
  }, [
    hsbDatas,
    maxColors,
    ignoreColor,
    ignoreHueDifference,
    ignoreSaturationDifference,
    ignoreBrightnessDifference,
    hueWeight,
    saturationWeight,
    brightnessWeight,
  ]);

  return null;
};

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  overflow: hidden;
`;

const initalSettings = {
  maxColors: 8,
  ignoreColor: { r: 0, g: 0, b: 0 } as { r: number; g: number; b: number },
  ignoreHueDifference: 10,
  ignoreSaturationDifference: 10,
  ignoreBrightnessDifference: 10,
  hueWeight: 1,
  saturationWeight: 1,
  brightnessWeight: 1,
  radius: 0.5,
  baseX: 0,
  baseY: 0,
  baseZ: 0,
  xScale: 1,
  yScale: 1,
  zScale: 1,
};

export const settingsStore = proxy({
  ...initalSettings,
});

export const canvasStore = proxy({
  rgbaDatas: [] as RGBADatapoint[],
  hsbDatas: [] as HSBDatapoint[],
  dots: [] as Dot[],
});

export const ThreeCanvas = ({}) => {
  const { dots } = useSnapshot(canvasStore);

  const imageStore = useCreateStore();
  const settingsStore2 = useCreateStore();

  const {
    maxColors,
    ignoreColor,
    ignoreHueDifference,
    ignoreSaturationDifference,
    ignoreBrightnessDifference,
    hueWeight,
    saturationWeight,
    brightnessWeight,
    radius,
    baseX,
    baseY,
    baseZ,
    xScale,
    yScale,
    zScale,
  } = useControls(
    {
      maxColors: { value: 8, min: 1, max: 20, step: 1 },
      ignoreColor: { value: { r: 0, g: 0, b: 0 } },
      ignoreHueDifference: { value: 10, min: 0, max: 360, step: 1 },
      ignoreSaturationDifference: { value: 10, min: 0, max: 100, step: 1 },
      ignoreBrightnessDifference: { value: 10, min: 0, max: 100, step: 1 },
      hueWeight: { value: 1, min: 0, max: 10, step: 0.1 },
      saturationWeight: { value: 1, min: 0, max: 10, step: 0.1 },
      brightnessWeight: { value: 1, min: 0, max: 10, step: 0.1 },
      radius: { value: 10.85, min: 0, max: 100, step: 0.01 },
      baseX: { value: -10.82, min: -50, max: 50, step: 0.01 },
      baseY: { value: 40.42, min: -50, max: 50, step: 0.01 },
      baseZ: { value: 30.44, min: -50, max: 50, step: 0.01 },
      xScale: { value: 30, min: 0, max: 50, step: 0.01 },
      yScale: { value: 30, min: 0, max: 50, step: 0.01 },
      zScale: { value: 30, min: 0, max: 50, step: 0.01 },
    },
    { store: settingsStore2 }
  ) as any;
  useEffect(() => {
    settingsStore.maxColors = maxColors;
    settingsStore.ignoreColor = ignoreColor;
    settingsStore.ignoreHueDifference = ignoreHueDifference;
    settingsStore.ignoreSaturationDifference = ignoreSaturationDifference;
    settingsStore.ignoreBrightnessDifference = ignoreBrightnessDifference;
    settingsStore.hueWeight = hueWeight;
    settingsStore.saturationWeight = saturationWeight;
    settingsStore.brightnessWeight = brightnessWeight;
    settingsStore.radius = radius;
    settingsStore.baseX = baseX;
    settingsStore.baseY = baseY;
    settingsStore.baseZ = baseZ;
    settingsStore.xScale = xScale;
    settingsStore.yScale = yScale;
    settingsStore.zScale = zScale;
  }, [
    maxColors,
    ignoreColor,
    hueWeight,
    saturationWeight,
    brightnessWeight,
    ignoreHueDifference,
    ignoreSaturationDifference,
    ignoreBrightnessDifference,
    radius,
    baseX,
    baseY,
    baseZ,
    xScale,
    yScale,
    zScale,
  ]);

  const { image } = useControls(
    {
      image: {
        image: "http://localhost:5173/2232e0da-d3fa-4301-85f3-c2d6812611ac",
      },
    },
    { store: imageStore }
  );

  return (
    <CanvasWrapper>
      {/* <Leva theme={theme} /> */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          display: "grid",
          width: 300,
          gap: 200,
          paddingBottom: 40,
          marginRight: 10,
          float: "left",
          // background: "#181C20",
        }}
      >
        <ControlsPanel
          titleBar={{
            title: "Settings",
            filter: false,
            position: { x: 0, y: 400 },
          }}
          collapsable={true}
          store={settingsStore2}
        />
        <ControlsPanel store={imageStore} />
        {/* <LevaPanel fill flat titleBar={false} store={spaceStore} />
        <LevaPanel fill flat titleBar={false} store={fontSizesStore} />
        <LevaPanel fill flat titleBar={false} store={sizesStore} />
        <LevaPanel fill flat titleBar={false} store={borderWidthsStore} />
        <LevaPanel fill flat titleBar={false} store={fontWeightsStore} /> */}
      </div>
      <CanvasMain dots={[...dots]} />
      <DotsUpdater />
      {image && (
        <GhostCanvas
          // loaded={loaded}
          imageSrc={image}
          // name={imageToUse?.name}
        ></GhostCanvas>
      )}
    </CanvasWrapper>
  );
};

const state = proxy({ current: null, mode: 0 });

function Model({ dot }: { dot: Dot }) {
  const { radius, baseX, baseY, baseZ, xScale, yScale, zScale } =
    useSnapshot(settingsStore);
  const ref = useRef<any>();
  const position = useMemo(() => {
    console.log("hue", dot.hue);
    console.log("saturation", dot.saturation);
    const x = dot.hue / 255;
    console.log("x", x);
    const y = dot.saturation / 100;
    console.log("y", y);
    const theta = Math.atan2(y - radius, x - radius);
    console.log("theta", theta);
    const newX = baseX + radius * Math.cos(theta) * xScale;
    const newY = baseY + radius * Math.sin(theta) * yScale;

    // brightness is the z
    const newZ = baseZ + (zScale * dot.brightness) / 100;

    console.log(
      `position mapped from h:${dot.hue} s:${dot.saturation} b:${dot.brightness} to x:${newX} y:${newY} z:${newZ}`
    );

    return [newX, newY, newZ];
  }, [dot, radius, baseX, baseY, baseZ, xScale, yScale, zScale]);

  const size = useMemo(() => {
    return dot.size / 1000;
  }, [dot]);

  useFrame((state) => {
    if (ref?.current) {
      //   const t = factor + state.clock.elapsedTime * (speed / 2);
      if (ref.current.scale) {
        ref.current.scale.setScalar(
          MathUtils.lerp(ref.current.scale.x, size, 0.1)
        );
      }
      ref.current.position.set(
        MathUtils.lerp(ref.current.position.x, position[0], 0.1),
        MathUtils.lerp(ref.current.position.y, position[2], 0.1),
        MathUtils.lerp(ref.current.position.z, position[1], 0.1)
      );
      //   console.log("ref.current", ref.current);
    }
  });
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Fetching the GLTF, nodes is a collection of all the meshes
  // It's cached/memoized, it only gets loaded and parsed once
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      ref={ref}
      // Click sets the mesh as the new target
      onClick={(e) => (e.stopPropagation(), state.current == dot.colorRgb)}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits
      onPointerMissed={(e) => e.type === "click" && (state.current = null)}
      // Right click cycles through the transform modes
      // onContextMenu={(e) =>
      //   snap.current === name &&
      //   (e.stopPropagation(), (state.mode = (snap.mode + 1) % modes.length))
      // }
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      material-color={
        snap.current === dot.colorRgb
          ? transparentize(0.5, dot.colorRgb)
          : dot.colorRgb
      }
      dispose={null}
    >
      <sphereGeometry />

      <meshBasicMaterial color={dot.colorRgb} depthTest={false} />
    </mesh>
  );
}

function Controls() {
  // Get notified on changes to state
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  return (
    <>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.75}
      />
    </>
  );
}

const CanvasMain = ({ dots }: { dots: Dot[] }) => {
  return (
    <Canvas shadows camera={{ position: [0, 20, 30], fov: 50 }} dpr={[1, 2]}>
      <pointLight position={[100, 100, 100]} intensity={0.8} />
      <hemisphereLight
        color="#ffffff"
        groundColor="#b9b9b9"
        position={[-7, 25, 13]}
        intensity={0.85}
      />
      <fog attach="fog" args={["#f2f2f5", 35, 60]} />
      {/* <group position={[0, 0, 0]}> */}

      <Suspense fallback={null}>
        <group position={[0, 10, 0]}>
          <Grid />
          <Shadows />
          {dots.map((dot) => (
            <Model key={dot.colorRgb} dot={dot} />
          ))}
        </group>
      </Suspense>
      <Controls />
    </Canvas>
  );
};

// const CanvasMain = ({ dots }: { dots: Dot[] }) => {
//   console.log("dots", dots);
//   //   const testDots = [
//   //     {
//   //       size: 56,
//   //       colorRgb: "#42f2f5",
//   //       hue: 208.57142857142873,
//   //       saturation: 12.574850299401195,
//   //       brightness: 65.49019607843137,
//   //     },
//   //   ];

//   return (
//     <Canvas shadows camera={{ fov: 30, position: [5, 17, 17] }}>
//       <color attach="background" args={["#f2f2f5"]} />
//       <fog attach="fog" args={["#f2f2f5", 35, 60]} />
//       <group position={[0, 0, 0]}>
//         <Grid />
//         <Shadows />
//         <Dots dots={dots} />
//       </group>
//       <Gizmo />
//     </Canvas>
//   );
// };

// function Dots({ dots }: { dots: Dot[] }) {
//   const ref = useRef<any>();
//   useFrame((state, delta) => {
//     if (ref?.current) {
//       void (ref.current.rotation.y = MathUtils.damp(
//         ref.current.rotation.y,
//         (-state.mouse.x * Math.PI) / 6,
//         2.75,
//         delta
//       ));
//     }
//   });
//   return (
//     <group ref={ref} castShadow receiveShadow position={[0, 5, 0]}>
//       {/* <meshStandardMaterial roughness={0} color="#f0f0f0" /> */}
//       {dots.map((dot, i) => (
//         <Dot key={i} dot={dot} />
//       ))}
//     </group>
//   );
// }

// function Dot({ dot }: { dot: Dot }) {
//   return (
//     <mesh ref={ref} userData={{ color: "blue" }}>
//       <sphereGeometry />

//       <meshBasicMaterial color={dot.colorRgb} depthTest={false} />
//     </mesh>
//   );
// }

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => {
  const theme = useTheme();
  return (
    <Instances castShadow receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[lineWidth, height]} />
      <meshBasicMaterial color={theme.bg2} />
      {Array.from({ length: number }, (_, y) =>
        Array.from({ length: number }, (_, x) => (
          <group
            position={[
              x * 2 - Math.floor(number / 2) * 2,
              -0.01,
              y * 2 - Math.floor(number / 2) * 2,
            ]}
          >
            <Instance key={1} rotation={[-Math.PI / 2, 0, 0]} />
            <Instance key={2} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
          </group>
        ))
      )}
      <gridHelper args={[100, 100, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />
    </Instances>
  );
};

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="lightblue"
    colorBlend={1}
    toneMapped={true}
    alphaTest={0.9}
    opacity={1}
    scale={15}
    position={[0, 0, 0]}
  >
    <RandomizedLight
      amount={8}
      radius={15}
      ambient={0.5}
      intensity={1}
      position={[-5, 10, 0]}
      bias={0.001}
    />
  </AccumulativeShadows>
));

interface GhostCanvasProps {
  imageSrc?: string;
}

const GhostCanvasWrapper = styled.div`
  z-index: -1;
  visibility: hidden;
`;

function GhostCanvas({ imageSrc }: GhostCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // console.log("imageSrc", imageSrc);

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
