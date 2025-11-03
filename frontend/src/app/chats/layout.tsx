import { headers } from "next/headers";
import { MasterLayout } from "@/components/MasterLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const viewport = headersList.get("x-viewport") || "desktop";

  const layoutProps = { LeftPanel: <LeftPanel />, RightPanel: children };
  return <MasterLayout {...layoutProps} initialViewport={viewport} />;
}

// SHOULD IMPORT AND FROM COMPONENT
const LeftPanel = () => {
  const myArray = Array.from({ length: 30 });

  return (
    <div className="flex flex-col justify-start">
      {myArray.map((_, index) => (
        <div key={index} className="flex justify-between p-2">
          {/** biome-ignore lint/performance/noImgElement: <explanation> */}
          <img
            src="https://images.pexels.com/photos/11280357/pexels-photo-11280357.jpeg"
            alt=""
            className="size-6 aspect-square rounded-full"
          />
          <div className="flex flex-col items-start justify-between min-w-10">
            <h4 className="text-lg">Victor</h4>
            <p className="truncate w-full">Hello this is some dummy text</p>
          </div>
        </div>
      ))}
    </div>
  );
};
