import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useThree } from "@react-three/fiber";

const Capture = () => {
    const { scene, camera, gl } = useThree();
  
    const captureImages = async (numImages = 16, cameraHeight = 1.5, scene) => {
      const zip = new JSZip();
      const radius = 5;
      const center = [0, cameraHeight, 0];
      const timestamp = new Date().toISOString().replace(/[:.]/g, "");
  
      for (let i = 0; i < numImages; i++) {
        const angle = (i * Math.PI * 2) / numImages;
        const cameraPosition = [
          center[0] + radius * Math.cos(angle),
          center[1],
          center[2] + radius * Math.sin(angle),
        ];
        const cameraLookAt = [center[0], center[1], center[2]];
  
        camera.position.fromArray(cameraPosition);
        camera.lookAt(...cameraLookAt);
  
        gl.render(scene, camera);
  
        const dataURL = gl.domElement.toDataURL("image/png");
  
        zip.file(`${i}.png`, dataURL.substr(dataURL.indexOf(",") + 1), {
          base64: true,
        });
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
  };

  export default Capture;