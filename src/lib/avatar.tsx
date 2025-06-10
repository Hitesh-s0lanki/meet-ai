import { createAvatar } from "@dicebear/core";
import { initials, botttsNeutral } from "@dicebear/collection";

type AvatarProps = {
  seed: string;
  variant?: "initials" | "botttsNeutral";
};

export const generateAvatarUri = ({
  seed,
  variant = "initials",
}: AvatarProps) => {
  const avatar = createAvatar(
    variant === "initials" ? initials : botttsNeutral,
    {
      seed,
    }
  );
  return avatar.toDataUri();
};
