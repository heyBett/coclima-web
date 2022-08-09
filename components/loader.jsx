import { BigLogo } from "./vectors/custom";
export default function Loader() {
  return (
    <div className="flex items-center justify-center bg-green-600 loading-overlay">
      <div className="bounce-loader">
        <div className="bounce1">
          <BigLogo className="w-24 h-24" />
        </div>
      </div>
    </div>
  );
}
