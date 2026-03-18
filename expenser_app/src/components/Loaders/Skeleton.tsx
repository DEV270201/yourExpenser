const SkeletonLoader = () => {
    return (
    <div className="expenser_container">
      <div className="skeleton-item" style={{ height: '150px' }}></div> {/* Summary Box */}
      <div className="skeleton-item"></div> {/* Trans 1 */}
      <div className="skeleton-item"></div> {/* Trans 2 */}
      <div className="skeleton-item"></div> {/* Trans 3 */}
    </div>
  );
}

export default SkeletonLoader;