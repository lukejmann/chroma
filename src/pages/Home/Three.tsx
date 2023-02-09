import { memo, useEffect, useMemo, useRef } from "react";
import { RGBELoader } from "three-stdlib";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
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
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import styled, { useTheme } from "styled-components/macro";
import { MathUtils, MeshBasicMaterial } from "three";
import { useControls } from "leva";

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

  return (
    <CanvasWrapper>
      <CanvasMain dots={[...dots]} />
      <DotsUpdater />
    </CanvasWrapper>
  );
};

const CanvasMain = ({ dots }: { dots: Dot[] }) => {
  console.log("dots", dots);
  //   const testDots = [
  //     {
  //       size: 56,
  //       colorRgb: "#42f2f5",
  //       hue: 208.57142857142873,
  //       saturation: 12.574850299401195,
  //       brightness: 65.49019607843137,
  //     },
  //   ];

  return (
    <Canvas shadows camera={{ fov: 30, position: [5, 17, 17] }}>
      <color attach="background" args={["#f2f2f5"]} />
      <fog attach="fog" args={["#f2f2f5", 35, 60]} />
      <group position={[0, 0, 0]}>
        <Grid />
        <Shadows />
        <Dots dots={dots} />
      </group>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.1}
        // enablePan={false}
        // enableZoom={false}
        dampingFactor={0.05}
        // minPolarAngle={Math.PI / 3}
        // maxPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

function Dots({ dots }: { dots: Dot[] }) {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref?.current) {
      void (ref.current.rotation.y = MathUtils.damp(
        ref.current.rotation.y,
        (-state.mouse.x * Math.PI) / 6,
        2.75,
        delta
      ));
    }
  });
  return (
    <group ref={ref} castShadow receiveShadow position={[0, 5, 0]}>
      {/* <meshStandardMaterial roughness={0} color="#f0f0f0" /> */}
      {dots.map((dot, i) => (
        <Dot key={i} dot={dot} />
      ))}
    </group>
  );
}

function Dot({ dot }: { dot: Dot }) {
  const ref = useRef<any>();
  const position = useMemo(() => {
    // calculate xy from the hue and saturation
    // hue is 0-255, saturation is 0-100
    // center of the circle is 0.5, 0.5
    // radius is 0.5
    console.log("hue", dot.hue);
    console.log("saturation", dot.saturation);
    const x = dot.hue / 255;
    console.log("x", x);
    const y = dot.saturation / 100;
    console.log("y", y);
    const r = 0.5;
    // hue should be the polar angle
    // saturation should be the distance from the center
    // const theta = Math.atan2(y - 0.5, x - 0.5);
    const theta = Math.atan2(y - 0.5, x - 0.5);
    console.log("theta", theta);
    const newX = r * Math.cos(theta) * 10;
    const newY = r * Math.sin(theta) * 10;

    // brightness is the z
    const newZ = 1 + (5 * dot.brightness) / 100;

    console.log(
      `position mapped from h:${dot.hue} s:${dot.saturation} b:${dot.brightness} to x:${newX} y:${newY} z:${newZ}`
    );

    return [newX, newY, newZ];
  }, [dot]);

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
  return (
    <mesh ref={ref} userData={{ color: "blue" }}>
      <sphereGeometry />

      <meshBasicMaterial color={dot.colorRgb} depthTest={false} />
    </mesh>
  );
}

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => {
  const theme = useTheme();
  return (
    <Instances castShadow receiveShadow position={[0, -1, 0]}>
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
