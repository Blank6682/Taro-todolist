import Taro from "@tarojs/taro"

const baseUrl="http://139.199.210.230:3000/";

// 定义接口
interface ListInterface{
    url:string,
    method:any,
    data?:object,
}

export default (options:ListInterface={
    url:"",
    method:"GET",
    data:{}
}) => {
    // loading加载
    Taro.showLoading({
        title:"加载中...",
    })
    // 获取请求
    return  Taro.request({
        url:baseUrl+options.url,
        method:options.method.toUpperCase(),
        data:{
            ...options.data,
        },
        header:{
            'Content-Type':"applicatioan/json",
        }
    }).then(res=>{

        // loading移除
        Taro.hideLoading();
        const {statusCode,data}=res;
        if(statusCode>=200 && statusCode<300){
            return data;
        }else{
            throw new Error("网络请求错误");
        }
    }).catch(()=>{
        throw new Error("请求异常");
    })
}