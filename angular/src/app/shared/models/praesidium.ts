export interface PraesidiumButtonI {
  text: string
  url: string
}

export interface PraesidiumDisplayI {
  name: string
  functie: string
  image: string
}
export interface PraesidiumCategorieI {
  categorieName: string
  categorieDescription: string
  praesidia: PraesidiumDisplayI[]
  button: PraesidiumButtonI
}
export interface PraesidiumGroupI {
  groupName: string
  groupDescription?: string
  categories: PraesidiumCategorieI[]
}
