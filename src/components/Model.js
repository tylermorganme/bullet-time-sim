import { useRef, useEffect, useCallback } from "react";
import { AnimationMixer } from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useGUI } from "../contexts/GUIContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Model = ({ url }) => {
  const { scene, camera, gl } = useThree();
  const fbx = useLoader(FBXLoader, url);
  const mixerRef = useRef();
  const actionRef = useRef();
  const { parameters, setLoading, setProgress, logCameraPositionRef} = useGUI();
  const {
    numCameras,
    cameraHeight,
    duration,
    fps,
    imageQuality,
    radius,
  } = parameters;

  const logCameraPosition = () => {
    console.log(camera.position);
  };

  logCameraPositionRef.current = logCameraPosition

  const captureImages = useCallback(
    async (numCameras, cameraHeight, scene, imageQuality) => {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "");

      const numFrames = fps * duration;
      const intervalBetweenFrames = duration / numFrames;

      // This is the total number of captures that will be made
      const totalCaptures = numCameras * numFrames;

      // Start a loading indication
      setLoading(true);
      setProgress(0);

      for (let i = 0; i < numCameras; i++) {
        const angle = (i * (Math.PI * 2)) / numCameras;
        const cameraPosition = [
          radius * Math.cos(angle),
          cameraHeight,
          radius * Math.sin(angle),
        ];

        const cameraLookAt = [0, cameraHeight, 0];

        camera.position.fromArray(cameraPosition);
        camera.lookAt(...cameraLookAt);

        for (let j = 0; j < numFrames; j++) {
          actionRef.current.time = j * intervalBetweenFrames;
          mixerRef.current?.update(0);
          
          gl.render(scene, camera);

          // Might need an artificial delay here because rendering wasn't done before the capture.
          //await new Promise(resolve => setTimeout(resolve, 100));
          await new Promise(resolve => requestAnimationFrame(resolve));

          console.log(`${i}_${j}.png`, camera.position, camera.rotation)
          const dataURL = gl.domElement.toDataURL("image/png");

          zip.file(`${i}_${j}.png`, dataURL.substr(dataURL.indexOf(",") + 1), {
            base64: true,
          });

          // Update the progress bar after each capture
          setProgress(((i * numFrames + j + 1) / totalCaptures) * 100);

          // Yield to the event loop
          await new Promise(requestAnimationFrame);
        }

        actionRef.current.time = 0;
      }

      const content = await zip.generateAsync({ type: "blob" });
      const file = new File([content], `${timestamp}.zip`, {
        type: "application/zip",
      });
      saveAs(file);

      // Stop loading indication
      setLoading(false);
      setProgress(0);
    },
    [
      fps,
      duration,
      gl,
      camera,
      setLoading,
      setProgress,
      radius,
      actionRef,
      mixerRef,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === "q" || event.keyCode === 81)) {
        captureImages(numCameras, cameraHeight, scene, imageQuality);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [scene, cameraHeight, numCameras, imageQuality, captureImages]); // dependencies updated

  useEffect(() => {
    if (fbx) {
      // Add the fbx model to the scene
      scene.add(fbx);

      // Apply parameters
      fbx.scale.set(parameters.scale, parameters.scale, parameters.scale);
      fbx.rotation.y = parameters.rotation;

      // Initialize AnimationMixer with the fbx model instead of the scene
      mixerRef.current = new AnimationMixer(fbx);
      mixerRef.current.timeScale = 0; // Prevent the mixer from auto-updating

      if (fbx.animations[0]) {
        actionRef.current = mixerRef.current.clipAction(fbx.animations[0]);
        actionRef.current.play();
      }
    }
  }, [fbx, scene, parameters.scale, parameters.rotation]);

  //Update animation time
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.time = parameters.animationTime;
    }
  }, [parameters.animationTime]);

  useEffect(() => {
    return () => mixerRef.current?.stopAllAction();
  }, []);

  useFrame(() => {
    // Manual update of the animation mixer
    mixerRef.current?.update(0);
  });

  return null;
};

export default Model;
