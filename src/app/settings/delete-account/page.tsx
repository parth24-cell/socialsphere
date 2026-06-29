import DeleteAccountForm from "./DeleteAccountForm";

export default function DeleteAccountPage() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Danger Zone</h2>
      <DeleteAccountForm />
    </div>
  );
}
