import { GridLoader } from "react-spinners";

export default function Spinner({ fullwidth }) {
  if (fullwidth) {
    return (
      <div className="w-fill flex justify-center">
        <GridLoader color={"#0e7490"} />
      </div>
    );
  }
  return <GridLoader color={"#0e7490"} speedMultiplier={2} />;
}
