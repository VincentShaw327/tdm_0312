// import fetch from 'dva/fetch';
import fetch from 'isomorphic-fetch';
import {format} from 'upath';
import {ENOPROTOOPT, EOPNOTSUPP} from 'constants';

// let urlBase = 'http://localhost:8888';
// export let urlBase = 'http://localhost:9000';
// export let urlBase = 'http://localhost:1111';
export let urlBase = gconfig.linkUrl;
export let mockUrlBase = 'http://localhost:1111';

// export  let urlBase = 'http://192.168.200.5';
// export  let urlBase = 'http://demo.mes.top-link.me';
// urlBase;

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    // console.log("请求的状态",response);

    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    else if(response.status >= 400 && response.status < 500){
        console.log("请求的状态",response);
        let statusText='';
        switch (response.status) {
            case 404:
                statusText="无法访问的页面,err code：404"
                break;
            case 500:
                statusText="内部服务器错误,err code：500"
                break;
            default:
                statusText=`${response.statusText},err code:${response.status}`
        }
        return Promise.reject(statusText);
        /*const error = new Error(response.statusText);
        error.response = response;
        console.log("err",error);
        throw error;
        cb(error)*/
    }

    // const error = new Error(response.statusText);
    // error.response = response;
    // throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function TFetch(url, options) {
    return fetch(url, options).then(checkStatus).then(parseJSON).then(data => ({data})).catch(err => ({err}));
}

// res 实际上该规范定义的 Response 对象，它有如下方法

// arrayBuffer()
// blob()
// json()
// text()
// formData()
export function TPostForm(url, form_id) {
    // 获取dat
    let dat = new FormData(document.getElementById(form_id));
    let options = {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Accept-Type': 'application/json;charset=utf-8'
        },
        body: dat
    };

    return TFetch(url, options);
}

export function TPostData(url, op, obj, cb, ecb) {
    let reqObj = {
        op: op,
        obj: JSON.stringify(obj)
    }

    fetch(urlBase + url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            // 'Accept-Type': 'application/json;charset=utf-8'
        }
    }).then(checkStatus,err=>ecb(err)).then(parseJSON)
    //.then(data => ({ data }))
    //.catch(err => ({ err }));
        .then((json) => {
        return cb(json);
    })
    .catch((err)=>{
        ecb(err);
    })
}

export function TPostMock(url, op, obj, cb, ecb) {
    let reqObj = {
        op: op,
        obj: JSON.stringify(obj)
    }

    fetch(mockUrlBase + url, {
        method: 'POST',
        // mode: 'cors',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            // 'Accept-Type': 'application/json;charset=utf-8'
        }
    })
    .then(checkStatus,err=>ecb(err))
    .then(parseJSON)
    .then((json) =>cb(json))
    .catch((err)=>ecb(err))
}



export function TPPostData(url, op, obj, cb, ecb) {
    let reqObj = {
        op: op,
        obj: JSON.stringify(obj)
    }

    return new Promise((resolve, reject) => {
        fetch(urlBase + url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(reqObj),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept-Type': 'application/json;charset=utf-8'
            }
        }).then(checkStatus).then(parseJSON).then((json) => {
            // cb(json);
            // resolve(cb(json));
            resolve(json);
        }).catch(err => {
            // ecb(err)
            // reject(ecb(err));
            reject(err);
        });
    })
}


function params(data) {
    var arr = [];
    for (var i in data) {
        arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
    }
    return arr.join('&');
}
//封装ajax
export function TAjax(method, url, op, obj, scb, fcb,async) {


    //创建xhr对象;
    let xhr=window.XMLHttpRequest?new XMLHttpRequest():
            new ActiveXObject("Microsoft.XMLHTTP");

    //后面随机数防止浏览器缓存
    let Url = urlBase + url + "?rand=" + Math.random();
    //序列化对象
    // obj.data = params(obj.data);

    //启动HTTP请求
    xhr.open(method, Url,async);

    //当是get请求时
    if (method == 'get') {
        //当前面没设置随机数时
        Url += Url.indexOf('?') == -1
            ? '?' + op
            : '&' + op;
    }
    else if (method === 'post') {
        //模仿表单提交
        xhr.setRequestHeader(
            'Content-Type',
            'application/json;charset=utf-8'
        );
            // 'Content-Type': 'application/json;charset=utf-8',
            // 'Accept-Type': 'application/json;charset=utf-8'
        //发送HTTP请求-post
        let reqObj = {
            op: op,
            obj: JSON.stringify(obj)
        };
        xhr.send(JSON.stringify(reqObj));
    }
    else {
        //发送HTTP请求-get
        xhr.send(null);
    }
    //异步调用
    if (async == true) {
        //监听响应状态
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback();
            }
        };
    }
    //同步调用
    if (async == false) {
        callback();
    }


    //回调函数传参
    function callback() {
        if (xhr.status == 200) {
            scb(JSON.parse(xhr.responseText));
        }
        else {
            alert("失败，失败状态码：" + xhr.status);
            fcb(xhr.status);
        }
    }
}
