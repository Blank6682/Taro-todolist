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
        method: "POST",
        data
    });
}

// // 删除任务
export function deleteTask (id) {
    return Request({
        url: `todo/${id}`,
        method: "DELETE"
    })
}

//编辑任务
export function getTask (id) {
    return Request({
        url: `todo/${id}`,
        method: "GET"
    });
}

//更新任务
export function updateTask (data) {
    return Request({
        url: `todo/${data.id}`,
        method: "PUT",
        data
    })
}