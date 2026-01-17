import { MasterLayout } from "@/shared/components/layout/MasterLayout";
import { FunnyGuys } from "@/shared/components/FunnyGuys";
import { ChatList } from "@/features/chat/components";

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
