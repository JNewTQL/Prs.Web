import RequestForm from "./RequestForm";

function RequestCreatePage() {
  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <h2 className="pb-4 mb-4 border-bottom border-2">Create New Request</h2>
      <RequestForm />
    </section>
  );
}

export default RequestCreatePage;
