import { InterceptingModal } from "@/components/intercepting-modal/intercepting-modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <InterceptingModal>{children}</InterceptingModal>;
}
