import CreateForm from "@/components/invoices/new-invoice-form";
import PageTitle from "@/components/page-title";

type CreateInvoiceProps = {};

export default async function CreateInvoice({}: CreateInvoiceProps) {
  return (
    <div>
      <PageTitle>New invoice</PageTitle>

      <CreateForm />
    </div>
  );
}
