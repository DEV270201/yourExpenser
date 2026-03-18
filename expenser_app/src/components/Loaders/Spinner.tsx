type props = {
    color: string;
}

const SpinnerLoader = ({color}: props) => {
  return (
    <div className="loading-overlay">
      <div className="spinner" style={{borderColor: color, borderBottomColor: 'transparent'}}></div>
      {/* <p className="mt-2 fw-bold text-primary">Syncing with AWS...</p> */}
    </div>
  ); 
};

export default SpinnerLoader;
