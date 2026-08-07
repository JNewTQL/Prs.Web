import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { vendorAPI } from "./VendorAPI";
import type { IVendor } from "./IVendor";
import bootstrapIcons from "../assets/bootstrap-icons.svg";

const emptyVendor: IVendor = {
  id: undefined,
  code: "",
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
};

function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IVendor>({
    defaultValues: async () => {
      if (!id) return emptyVendor;
      return await vendorAPI.find(Number(id));
    },
  });

  const save = async (vendor: IVendor) => {
    if (vendor.id) {
      await vendorAPI.put(vendor);
    } else {
      await vendorAPI.post(vendor);
    }
    navigate("/vendors");
  };

  return (
    <form className="w-100" onSubmit={handleSubmit(save)} noValidate>
      <div className="d-flex gap-3 mb-3">
        <div className="w-25">
          <label htmlFor="code" className="form-label text-muted">
            Vendor Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="Enter short vendor code"
            maxLength={7}
            className={`form-control ${errors.code ? "is-invalid" : ""}`}
            {...register("code", { required: "Vendor Code is required." })}
          />
          <div className="invalid-feedback">{errors.code?.message}</div>
        </div>

        <div className="w-75">
          <label htmlFor="name" className="form-label text-muted">
            Vendor Name
          </label>
          <input id="name" type="text" placeholder="Enter vendor name" className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name", { required: "Vendor Name is required." })} />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="address" className="form-label text-muted">
          Address
        </label>
        <input
          id="address"
          type="text"
          placeholder="Enter vendor's address"
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
          {...register("address", { required: "Address is required." })}
        />
        <div className="invalid-feedback">{errors.address?.message}</div>
      </div>

      <div className="d-flex gap-3 mb-3">
        <div className="w-50">
          <label htmlFor="city" className="form-label text-muted">
            City
          </label>
          <input id="city" type="text" placeholder="Enter city" className={`form-control ${errors.city ? "is-invalid" : ""}`} {...register("city", { required: "City is required." })} />
          <div className="invalid-feedback">{errors.city?.message}</div>
        </div>

        <div className="w-25">
          <label htmlFor="state" className="form-label text-muted">
            State
          </label>
          <select id="state" className={`form-select ${errors.state ? "is-invalid" : ""}`} {...register("state", { required: "State is required." })}>
            <option value="">Select state...</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
          <div className="invalid-feedback">{errors.state?.message}</div>
        </div>

        <div className="w-25">
          <label htmlFor="zip" className="form-label text-muted">
            Zip
          </label>
          <input id="zip" type="text" placeholder="Enter zip code" className={`form-control ${errors.zip ? "is-invalid" : ""}`} {...register("zip", { required: "Zip Code is required." })} />
          <div className="invalid-feedback">{errors.zip?.message}</div>
        </div>
      </div>
      <div className="d-flex gap-3 mb-5">
        <div className="w-50">
          <label htmlFor="phone" className="form-label text-muted">
            Phone
          </label>
          <input id="phone" type="tel" placeholder="Enter phone number" className={`form-control ${errors.phone ? "is-invalid" : ""}`} {...register("phone")} />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>

        <div className="w-50">
          <label htmlFor="email" className="form-label text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", {
              pattern: {
                value: /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-2">
        <button type="button" className="btn btn-outline-primary px-4" onClick={() => navigate("/vendors")}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={isSubmitting}>
          <svg className="bi pe-none me-2" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          {isSubmitting ? "Saving..." : "Save Vendor"}
        </button>
      </div>
    </form>
  );
}

export default VendorForm;
