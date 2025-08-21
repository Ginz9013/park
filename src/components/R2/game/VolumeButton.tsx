import { useVolume } from "@/hooks/useVolume";

type VolumeButtonProps = {
  className?: string;
}

const VolumeButton: React.FC<VolumeButtonProps> = ({ className }) => {

  const { isMute, toggleMute } = useVolume();  
  
  return (
    <button onClick={toggleMute} className={className}>
      <img
        src={isMute
          ? "./elements/r2/mute_button.png"
          : "./elements/r2/volume_button.png"}
        alt="voice button"
      />
    </button>
  );
}

export default VolumeButton;