import { MasterLayout } from "@/shared/components/layout/MasterLayout";
import { ChatList } from "@/features/chat/components";
import { ChatWindow } from "@/features/chat/components";

export default function ChatDetailPage() {
  return <MasterLayout LeftPanel={<ChatList />} RightPanel={<ChatWindow />} />;
}
