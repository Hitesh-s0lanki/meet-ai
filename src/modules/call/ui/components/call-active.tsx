import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

type CallActiveProps = {
  onLeave: () => void;
  meetingName: string;
};

export const CallActive = ({ onLeave, meetingName }: CallActiveProps) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="flex rounded-full p-4 items-center gap-4 bg-[#101213]">
        <Link
          href="/"
          className="flex items-center justify-center p-1 bg-white/10 rounded-full">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="rounded-full px-4 bg-[#101213]">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
