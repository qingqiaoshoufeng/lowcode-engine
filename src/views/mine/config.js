import collect from '@/assets/images/collect.png'
import editor from '@/assets/images/editor.png'
import message from '@/assets/images/message.png'
import notice from '@/assets/images/notice.png'
import wait from '@/assets/images/wait.png'
import handled from '@/assets/images/handled.png'
import router from '@/router/index.js'
export const entryList = [
  // {
  //   icon:wait,
  //   label:'我的待办',
  // },
  {
    icon:handled,
    label:'我的已办',
    click:function(){
      router.push('/have-done')
    }
  },
  {
    icon:message,
    label:'我的消息',
  },
  {
    icon:collect,
    label:'我的收藏',
    click:function(){
      router.push('/mine-collect')
    }
  }, {
    icon:notice,
    label:'公告通知',
    click:function(){
      router.push('/noticeList')
    }
  },
  {
    icon:editor,
    label:'修改密码',
    path: '/changePassword',
  }
]