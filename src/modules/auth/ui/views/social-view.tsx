
import { authClient } from "@/lib/auth-client"
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa"
import { Button } from "@/components/ui/button"

type SocialViewProps = {
	setError: (error: string | null) => void
	setIsPending: (isPending: boolean) => void
	isPending: boolean
}

export const SocialView = ({
	setError,
	setIsPending,
	isPending,
}: SocialViewProps) => {
	const onSocial = (provider: "google" | "github" | "microsoft") => {
		setError(null)
		setIsPending(true)

		authClient.signIn.social(
			{
				provider,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					setIsPending(false)
					setError(null)
				},
				onError: ({ error }) => {
					setIsPending(false)
					setError(error.message)
				},
			},
		)
	}

	return (
		<div className="grid grid-cols-3 gap-2">
			<Button
				disabled={isPending}
				onClick={() => onSocial("github")}
				variant="outline"
				type="button"
				className="w-full">
				<FaGithub />
			</Button>
			<Button
				disabled={isPending}
				onClick={() => onSocial("google")}
				variant="outline"
				type="button"
				className="w-full">
				<FaGoogle />
			</Button>
			<Button
				disabled={isPending}
				onClick={() => onSocial("microsoft")}
				variant="outline"
				type="button"
				className="w-full">
				<FaMicrosoft />
			</Button>
		</div>
	)
}
