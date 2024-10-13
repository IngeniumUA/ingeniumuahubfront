export interface FlagInI {
  name: string;
}

export interface FlagI {
  id: number
  name: string
  value: { [key: string]: string }
}

export interface FlagPatchI {
  value: object
}
