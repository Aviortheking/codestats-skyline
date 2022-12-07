export interface XP {
	new_xps: number
	xps: number
}

export interface CodeStatsJSON {
	dates: Record<`${number}-${number}-${number}`, number>
	languages: Record<string, XP>
	machines: Record<string, XP>
	new_xp: number
	total_xp: number
	user: string
}