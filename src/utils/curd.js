import { useList } from '@castle/castle-use'
import { partial } from 'lodash'

export const getList = partial(useList, { page: 'page', limit: 'limit', list: 'list', total: 'total' })

