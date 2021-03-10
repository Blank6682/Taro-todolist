import Request from "../utils/request";

// 获取任务列表
export function getTaskList () {
    return Request({
        url: "todo",
        method: "GET"
    });
}

// 添加任务
export function addTask (data) {
    return Request({
        url: "todo",
        method: "post",
        data
    });
}

// // 删除任务
export function deleteTask (id) {
    return Request({
        url: `todo/${id}`,
        method: "delete"
    })
}

//编辑任务
export function getTask (id) {
    return Request({
        url: `todo/${id}`,
        method: "get"
    });
}

//更新任务
export function updateTask (data) {
    return Request({
        url: `todo/${data._id}`,
        method: "put"
    })
}