import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IVendor } from "./IVendor";
import { vendorAPI } from "./VendorAPI";
import VendorCard from "./VendorCard";
import VendorCardSkeleton from "./VendorCardSkeleton";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";

function VendorPage() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<IVendor[]>([]);

  const removeVendor = (vendorToRemove: IVendor) => {
    setVendors(vendors.filter((s) => s.id !== vendorToRemove.id));
  };

  async function loadVendor() {
    setLoading(true);

    try {
      const data = await vendorAPI.list();

      setVendors(data);
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendor();
  }, []);

  const vendorCardSkeletons = Array.from(Array(12), (_v, i) => <VendorCardSkeleton key={i} />);

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom border-2">
        <h2>Vendors ({vendors.length})</h2>
        <Link to="/vendors/create" className="btn btn-primary">
          <svg className="bi pe-none me-2" width={32} height={32} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Add Vendor
        </Link>
      </div>

      <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
        {loading && vendorCardSkeletons}
        {!loading && vendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} onRemove={removeVendor} />)}
      </section>
    </section>
  );
}

export default VendorPage;
