import { Text } from "@react-three/drei";

const Axes = () => {
    return (
      <>
        <axesHelper args={[10]} />
        <Text position={[11, 0, 0]} rotation={[0, 0, 0]} text="X" color="black" />
        <Text position={[0, 11, 0]} rotation={[0, 0, 0]} text="Y" color="black" />
        <Text position={[0, 0, 11]} rotation={[0, 0, 0]} text="Z" color="black" />
      </>
    );
  };

  export default Axes