import {
  MdMicOff,
  MdVideoCall,
  MdCallEnd,
  MdMic,
  MdSpeaker,
  MdCamera,
} from "react-icons/md";

export default function Calls() {
  return (
    <div className="h-screen flex flex-col justify-between pt-12 pb-5">
      <div className="flex flex-col items-center">
        <img
          src=""
          alt=""
          className="w-20 h-20 bg-secondary rounded-full md:w-28 md:h-28 lg:w-28 lg:h-28"
        />
        <h1 className="mt-1 text-2xl md:text-3xl">Name</h1>
        <p className="mt-[2px] text-sm text-muted-foreground">Status</p>
      </div>
      <div className="mx-auto w-full max-w-lg flex items-center justify-evenly">
        <span className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl">
          {true ? <MdMic /> : <MdMicOff />}
        </span>
        <span className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl">
          {true ? <MdSpeaker /> : <MdMicOff />}
        </span>
        <span className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl">
          {true ? <MdVideoCall /> : <MdVideocam />}
        </span>
        <span className="w-12 h-12 grid place-items-center bg-red-500 hover:bg-red-600 cursor-pointer rounded-full text-4xl">
          <MdCallEnd />
        </span>
      </div>
    </div>
  );
}
