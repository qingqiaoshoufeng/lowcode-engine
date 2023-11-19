import collect from '@/assets/images/collect.png'
import editor from '@/assets/images/editor.png'
import message from '@/assets/images/message.png'
import notice from '@/assets/images/notice.png'
import wait from '@/assets/images/wait.png'
import handled from '@/assets/images/handled.png'
export const entryList = [
  {
    icon:wait,
    label:'我的待办',
  },
  {
    icon:handled,
    label:'我的已办',
  },
  {
    icon:message,
    label:'我的消息',
  },
  {
    icon:collect,
    label:'我的收藏',
  }, {
    icon:notice,
    label:'公告通知',
  },
  {
    icon:editor,
    label:'修改密码',
    path: '/changePassword',
  }
]