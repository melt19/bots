export type CommandResponse = {
  id: string
  application_id: string
  version: string
  default_member_permissions: null | any
  type: number
  name: string
  name_localizations: null | any
  description: string
  description_localizations: null | any
  dm_permission: boolean
  contexts: null | any
  nsfw: boolean
}[]