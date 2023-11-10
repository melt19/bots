import 'dotenv'

const { MELA_OW_U, MELA_OW_I, MELT_OW_U, MELT_OW_I, MELT_VAL_U, MELT_VAL_I, BULL_OW_U, BULL_OW_I, SAM_OW_U, SAM_OW_I, CRI_OW_U, CRI_OW_I } = process.env

export const profiles : { [ game: string ]: { [player: string] : { username: string, identifier: string}} }= {
  'overwatch': {
    'melahan': { username: MELA_OW_U, identifier: MELA_OW_I },
    'melt': { username: MELT_OW_U, identifier: MELT_OW_I },
    'bulldog': { username: BULL_OW_U, identifier: BULL_OW_I },
    'sam': { username: SAM_OW_U, identifier: SAM_OW_I },
    'cri': { username: CRI_OW_U, identifier: CRI_OW_I }
  },
  'valorant': {
    'melt': { username: MELT_VAL_U, identifier: MELT_VAL_I },
  }
}