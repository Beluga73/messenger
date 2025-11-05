export default async function Chat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // console.log(params);

  return <div>{(await params).id}</div>;
}
