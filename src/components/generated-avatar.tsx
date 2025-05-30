import { createAvatar } from "@dicebear/core"
import { initials, botttsNeutral } from "@dicebear/collection"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type GeneratedAvatarProps = {
	seed: string
	className?: string
	variant: "initials" | "botttsNeutral"
}

export const GeneratedAvatar = ({
	seed,
	className,
	variant,
}: GeneratedAvatarProps) => {
	let avatar: ReturnType<typeof createAvatar>

	if (variant === "botttsNeutral") {
		avatar = createAvatar(botttsNeutral, {
			seed,
		})
	} else {
		avatar = createAvatar(initials, {
			seed,
			fontWeight: 500,
			fontSize: 42,
		})
	}
	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatar.toDataUri()} />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	)
}