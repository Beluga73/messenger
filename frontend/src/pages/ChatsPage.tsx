import { MasterLayout } from "@/shared/components/layout/MasterLayout";
import { FunnyGuys } from "@/shared/components/FunnyGuys";

export default function ChatsPage() {
  return (
    <MasterLayout
      LeftPanel={<LeftPanel />}
      RightPanel={
        <div className="flex justify-center items-center w-full h-full">
          <FunnyGuys />
        </div>
      }
    />
  );
}

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
