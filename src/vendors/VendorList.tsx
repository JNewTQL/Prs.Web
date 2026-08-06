import VendorCard from "./VendorCard";
import type { IVendor } from "./IVendor";
import VendorCardSkeleton from "./VendorCardSkeleton";

interface IVendorListProps {
  vendors: IVendor[];
  loading: boolean;
  onRemove: (vendor: IVendor) => void;
}

function VendorList({ vendors, loading, onRemove }: IVendorListProps) {
  const vendorCardSkeletons = Array.from(Array(12), (_value, index) => <VendorCardSkeleton key={index} />);

  return (
    <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
      {loading && vendorCardSkeletons}
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} onRemove={onRemove} />
      ))}
    </section>
  );
}

export default VendorList;
