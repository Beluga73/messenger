import { ChatList } from "@/features/chat/components";
import { FunnyGuys } from "@/shared/components/FunnyGuys";
import { MasterLayout } from "@/shared/components/layout/MasterLayout";

export default function ChatsPage() {
  return (
    <MasterLayout
      LeftPanel={<ChatList />}
      RightPanel={
        <div className="flex justify-center items-center w-full h-full">
          <FunnyGuys />
        </div>
      }
    />
  );
}
