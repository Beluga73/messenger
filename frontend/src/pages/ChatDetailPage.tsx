import { ChatList, ChatWindow } from "@/features/chat/components";
import { MasterLayout } from "@/shared/components/layout/MasterLayout";

export default function ChatDetailPage() {
  return <MasterLayout LeftPanel={<ChatList />} RightPanel={<ChatWindow />} />;
}
