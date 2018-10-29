import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const MoldListState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const moldList = handleActions({
  'request mold list'(state, action) {
    return { ...state, loading: true }
  },
  'receive mold list'(state, action) {
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
                    Name:Mock.mock('@cname'),

                    Number:'process_'+index,
                    MoldModelName:'模具'+index,
                    ModelName:'模具'+index,
                    'ModelUUID|1':['RCA3.0','RCA6.0','HDMI','USB'],
                    Number:'moldmodel_'+index,
                    MoldModelID:'moldmodel_'+index,
                    Label:Mock.mock('@string'),
                    ModelSize:Mock.mock('@natural(0, 24)'),
                    MoldModelSize:Mock.mock('@natural(0, 24)'),
                    Cavity:Mock.mock('@natural(0, 24)'),
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    'isQCheck|1':['是','否'],
                    Hours:Mock.mock('@natural(0, 24)'),
                    Desc:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
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

}, MoldListState)

const MoldModelListState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const moldModel = handleActions({
  'request mold model list'(state, action) {
    return { ...state, loading: true }
  },
  'receive mold model list'(state, action) {
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
                    Name:Mock.mock('@cname'),

                    Number:'process_'+index,
                    MoldModelName:'模具'+index,
                    'ModelUUID|1':['RCA3.0','RCA6.0','HDMI','USB'],
                    MoldModelID:'moldmodel_'+index,
                    ID:'moldmodel_'+index,
                    MoldModelSize:Mock.mock('@natural(0, 24)'),
                    Cavity:Mock.mock('@natural(0, 24)'),
                    'TypeName|1':['注塑模具','冲压模具'], //类别名称
                    'isQCheck|1':['是','否'],
                    Hours:Mock.mock('@natural(0, 24)'),
                    Desc:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            // res.totalcount=Mock.mock('@natural(0, 65)');
            res.totalcount=20;
            return {list:list,total:res.totalcount, loading: false }
        }
    }
  },

}, MoldModelListState)
