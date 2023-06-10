import { useRef, useEffect } from "react";
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
  const { parameters, setParameters } = useGUI();
  const { duration, fps } = parameters;

  useEffect(() => {
    const captureImages = async (
      numCameras = 16,
      cameraHeight = 1.5,
      scene
    ) => {
      const zip = new JSZip();
      const radius = 5;
      const center = [0, cameraHeight, 0];
      const timestamp = new Date().toISOString().replace(/[:.]/g, "");
    
      const numFrames = fps * duration;
      const intervalBetweenFrames = duration / numFrames;
    
      for (let i = 0; i < numCameras; i++) {
        const angle = (i * Math.PI * 2) / numCameras;
        const cameraPosition = [
          center[0] + radius * Math.cos(angle),
          center[1],
          center[2] + radius * Math.sin(angle),
        ];
        const cameraLookAt = [center[0], center[1], center[2]];
    
        camera.position.fromArray(cameraPosition);
        camera.lookAt(...cameraLookAt);
    
        for (let j = 0; j < numFrames; j++) {
          actionRef.current.time = j * intervalBetweenFrames;
          mixerRef.current?.update(intervalBetweenFrames);
          gl.render(scene, camera);
    
          const dataURL = gl.domElement.toDataURL("image/png");
    
          zip.file(`${i}_${j}.png`, dataURL.substr(dataURL.indexOf(",") + 1), {
            base64: true,
          });
        }
      }
    
      const content = await zip.generateAsync({ type: "blob" });
      const file = new File([content], `${timestamp}.zip`, {
        type: "application/zip",
      });
      saveAs(file);
    };

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && (event.key === "q" || event.keyCode === 81)) {
        // Ctrl + Q was pressed, trigger your function here
        captureImages(16, 1.5, scene);
      }
    });

    return () => {
      document.removeEventListener("keydown", captureImages);
    };
  }, [scene, camera, duration, fps, gl, setParameters]);

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
  }, [fbx, scene, parameters]);

  // Update animation time
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
