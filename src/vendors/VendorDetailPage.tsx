import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { IVendor } from "./IVendor";
import { vendorAPI } from "./VendorAPI";

function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<IVendor | undefined>(undefined);
  const navigate = useNavigate();

  async function loadVendor() {
    setLoading(true);
    try {
      setVendor(await vendorAPI.find(Number(id)));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendor();
  }, []);

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between pb-4 mb-4 border-bottom border-2">
        <span>
          <h2>Vendor</h2>
        </span>
        <button type="button" onClick={() => navigate("/vendors")} className="btn fs-6 btn-outline-primary">
          Back to Vendors
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {vendor && (
        <div className="row d-flex flex-wrap gap-4">
          <dl>
            <dt>Name</dt>
            <dd>{vendor.name}</dd>

            <dt>Sort Order</dt>
            <dd>{vendor.name}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}

export default VendorDetailPage;
