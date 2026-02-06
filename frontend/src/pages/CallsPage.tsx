// FIXME: MOCK
import { useFlags } from "launchdarkly-react-client-sdk";

import { ToggleModeButton } from "@/shared/components/ToggleModeButton";

export default function CallsPage() {
  const { firstFeatureFlag } = useFlags();

  return (
    <>
      {firstFeatureFlag && (
        <div className="fixed inset-0">
          <p>Toggle mode!</p>
          <ToggleModeButton />
        </div>
      )}
      <div className="h-screen flex items-center justify-center text-3xl">Calls Page (mock)</div>
    </>
  );
}
