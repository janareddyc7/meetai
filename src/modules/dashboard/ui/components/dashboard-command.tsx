import type { Dispatch, SetStateAction } from "react"

import {
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from "@/components/ui/command"

type DashboardCommandProps = {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
	return (
		<CommandResponsiveDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Find a meeting or agent..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandItem>Test</CommandItem>
			</CommandList>
		</CommandResponsiveDialog>
	)
}