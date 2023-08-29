import { Audio } from 'react-loader-spinner';

export function Loader({ height }) {
  return (
    <div style={{ height: height }} className="loader-component">
      <Audio
        height="100"
        width="100"
        color="#dfe1e6"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  );
}
