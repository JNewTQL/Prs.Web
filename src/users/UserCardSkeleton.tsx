function UserCardSkeleton() {
  return (
    <div className="card p-4" style={{ width: "23rem" }}>
      <span className="fs-4 fw-medium skeleton skeleton-text mb-1" style={{ width: "60%" }}></span>
      <span className="fs-5 fw-light skeleton skeleton-text mb-1" style={{ width: "40%" }}></span>
      <span className="fs-5 fw-light skeleton skeleton-text mb-1" style={{ width: "50%" }}></span>
      <span className="fs-5 fw-light skeleton skeleton-text mb-2" style={{ width: "70%" }}></span>
    </div>
  );
}

export default UserCardSkeleton;
