import UserForm from "@/app/admin/user-management/user-form"

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <UserForm mode="edit" id={id} />
}