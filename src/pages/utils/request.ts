import Taro from "@tarojs/taro"

const baseUrl="http://139.199.210.230:3000/";

// 定义接口
interface ListInterface{
    url:string,
    method:any,
    data?:object,
}

export default (options:ListInterface) => {
    // loading加载
    Taro.showLoading({
        title:"加载中...",
    })
    // console.log(options,'配置项')
    return new Promise((resolve:Function,reject:Function)=>{
        Taro.request({
            url:baseUrl+options.url,
            method:options.method.toUpperCase(),
            data:options.data,
            header: {
                'content-type': 'application/json' // 默认值
              },
              success:(res)=>{
                //   console.log(res.data,'返回结果')
                Taro.hideLoading();
                if(res.statusCode >= 200 && res.statusCode < 300){
                    resolve(res.data)
                }
              },
              fail:(err)=>{
                  reject(err)
              }
        })
    })
}