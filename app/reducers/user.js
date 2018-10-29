import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const UserAccountState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const UserAccount = handleActions({
  'request user account list'(state, action) {
    return { ...state, loading: true }
  },
  'receive user account list'(state, action) {
    const { req, res } = action.payload
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            return { obj:res.obj.objectlist, loading: false }
        }
        else{
            list=res.objectlist.map((item,index)=>{
                return{
                    UUID:item.UUID,
                    key:index,
                    Name:'user_'+index,

                    LoginName:Mock.mock('@cname'),
                    Email:Random.email(),
                    Mobile:'13800001111',
                    Phone:'0755-23455432',
                    Number:'process_'+index,
                    ID:'moldmodel_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Note:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    ActiveDateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            // res.totalcount=Mock.mock('@natural(0, 65)');
            res.totalcount=20;
            return { list:list,total:res.totalcount, loading: false }
        }
    }
  },

}, UserAccountState)

/*用户权限组*/
const UserGroupState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const UserGroup = handleActions({
  'request user group list'(state, action) {
    return { ...state, loading: true }
  },
  'receive user group list'(state, action) {
    const { req, res } = action.payload
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            return { obj:res.obj.objectlist, loading: false }
        }
        else{
            list=res.objectlist.map((item,index)=>{
                return{
                    UUID:item.UUID,
                    key:index,
                    Name:'权限组_'+index,

                    LoginName:Mock.mock('@cname'),
                    Email:Random.email(),
                    Mobile:'13800001111',
                    Phone:'0755-23455432',
                    Number:'process_'+index,
                    ID:'authGroup_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Note:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    ActiveDateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { list:list,total:res.totalcount, loading: false }
        }
    }
  },

}, UserGroupState)


/*用户权限组*/
const UserAuthState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const UserAuth = handleActions({
  'request user auth list'(state, action) {
    return { ...state, loading: true }
  },
  'receive user auth list'(state, action) {
    const { req, res } = action.payload
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            return { obj:res.obj.objectlist, loading: false }
        }
        else{
            list=res.objectlist.map((item,index)=>{
                return{
                    UUID:item.UUID,
                    key:index,
                    Name:'权限_'+index,
                    Code:'auth_'+index,

                    LoginName:Mock.mock('@cname'),
                    Email:Random.email(),
                    Mobile:'13800001111',
                    Phone:'0755-23455432',
                    Number:'process_'+index,
                    ID:'moldmodel_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Note:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    ActiveDateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { list:list,total:res.totalcount, loading: false }
        }
    }
  },

}, UserAuthState)
