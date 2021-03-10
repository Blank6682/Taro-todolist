<template>
  <view class="todolist-warp">
    <!-- 顶部导航 -->

    <view class="navbar-warp">
      <AtNavBar
        color="#000"
        left-icon-type="close"
        right-first-icon-type="user"
      >
        <view>ToDoList</view>
      </AtNavBar>
    </view>

    <!-- 标题 -->
    <view class="title-warp">
      <view class="title-content"> 我的一天 </view>
      <view class="title-time">
        {{ getTimeData() }}
      </view>
    </view>

    <!-- 任务列表 -->
    <view class="list-warp">
      <!--没有任务提醒-->
      <view v-if="todoList.length <= 0" class="no-data-tips">
        <view>
          <AtIcon value="calendar" size="80" />
        </view>

        <text>没有待办</text>
      </view>
      <!-- 列表 -->
      <view v-for="(item, index) in todoList" :key="index" class="task-list">
        <view class="task-list-item">
          <!-- 完成任务选择 -->
          <view :on-click="handleSeletChange">
            <checkbox value="item.name" :checked="item.isDone" />
          </view>

          <view>
            <view
              class="task-list-item-name"
              :style="{ textDecoration: item.isDone ? 'line-through' : 'none' }"
            >
              {{ item.name }}
            </view>
            <view
              class="task-list-item-schedule"
              :style="{ color: item.isDone ? '#c0c0c0' : '#000000' }"
            >
              {{ item.isDone ? "已完成" : "正在进行" }}
            </view>
          </view>
          <!-- 右边图标 -->
          <view class="task-list-item-icon">
            <AtIcon
              :on-click="handleStarClick"
              :value="item.isImportant ? 'star-2' : 'star'"
              :style="{ color: item.isImportant ? 'red' : '#c0c0c0' }"
              size="30"
            />
            <AtIcon value="trash" :on-click="handleIsDelete" size="30" />
          </view>
        </view>
      </view>
    </view>
    <!-- 是否删除弹窗 -->
    <view v-if="isDelete" class="popup-delete">
      <view class="popup-delete-title"> 是否要删除该任务? </view>
      <view class="popup-delete-btn">
        <button typr="warn" @tap="handleIsDelete">取消</button>
        <button type="primary" @tap="handleDelete">确认</button>
      </view>
    </view>
    <!-- 底部添加任务 -->
    <view class="addTask-warp">
      <button @tap="handleIsShow">
        <AtIcon value="add" size="30" color="#c0c0c0" /> 添加任务
      </button>
    </view>

    <!-- 底部增删弹窗 -->
    <view class="popup-warp">
      <AtFloatLayout
        v-if="isShow"
        is-opened
        title="编辑"
        :on-close="handleIsShow"
      >
        <AtForm>
          <AtInput
            :value="value"
            name="name"
            title="待办事项"
            type="text"
            placeholder="请输入待办事项"
            :on-change="handleChange"
          />
          <AtInput
            name="remark"
            title="备注"
            type="text"
            placeholder="请输入备注"
            value="addTaskForm.remark"
          />
          <view class="popup-isDone">
            <text>已完成：</text>
            <radio-group v-model="addTaskForm.isDone" class="isDone">
              <radio :value="true" :name="true"> 是 </radio>
              <radio :value="false" :name="false"> 否 </radio>
            </radio-group>
          </view>
          <view class="popup-isImportant">
            <text>重要事项：</text>
            <radio-group v-model="addTaskForm.isImprotant" class="isImprotant">
              <radio :value="true"> 是 </radio>
              <radio :value="false"> 否 </radio>
            </radio-group>
          </view>
          <view class="popup-btn-save">
            <button type="primary" @tap="handleIsShow">保存</button>
          </view>
        </AtForm>
      </AtFloatLayout>
    </view>
  </view>
</template>

<script>
// 按需引入, 更小的应用体积
import {
  AtInput, AtForm, AtIcon, AtNavBar, AtFloatLayout,
} from "taro-ui-vue"
import { getTaskList, addTask, deleteTask, updateTask } from "../api/todolist"
import "taro-ui-vue/dist/style/components/icon.scss"
import "taro-ui-vue/dist/style/components/flex.scss"
import "taro-ui-vue/dist/style/components/nav-bar.scss"
import "taro-ui-vue/dist/style/components/action-sheet.scss"
import "taro-ui-vue/dist/style/components/input.scss"
import "taro-ui-vue/dist/style/components/float-layout.scss"
import "taro-ui-vue/dist/style/components/message.scss"
import Taro from "@tarojs/taro"
import dayjs from "dayjs"
import './index.scss'

export default {
  components: {
    AtFloatLayout,
    AtIcon,
    AtNavBar,
    AtInput,
    AtForm,
  },
  data () {
    return {
      isDone: false,
      isDelete: false,
      isShow: false,
      addTaskForm: [{
        name: "1",
        isDone: false,
        isImportant: false,
        remark: "3"
      }],
      todoList: []
    }
  },
  mounted () {
    this.getTasks()
  },
  methods: {
    //获取当前时间
    getTimeData () {
      return dayjs(new Date()).format("YYYY/MM/DD");
    },
    // //获取任务列表
    getTasks () {
      getTaskList().then((res) => {
        this.todoList = res.data;
        console.log(this.todoList);
      })
    },
    //处理Input框的输入事件
    handleChange () {
      return value;
    },

    //处理添加任务
    handleAddTask () {
      addTask(this.addTaskForm).then((res) => {
        if (res) {
          this.isShow = false;
          this.getTasks();
          //   Taro.atMessage({ type: "succcess", message: "修改成功", duration: 1000 });
        }
      }).catch(() => {
        // Taro.atMessage({ type: "danger", message: "修改失败", duration: 1000 });
      })
    },

    // 处理删除事项
    handleIsDelete () {
      this.isDelete = !this.isDelete;
    },
    handleDelete (id) {
      deleteTask(id).then((res => {
        if (res) {
          this.getTasks();
        }
      })).catch(() => { });
    },

    //处理保存更新
    handleUpdateTask () {
      updateTask(this.addTaskForm).then((res) => {
        this.isShow = false;
        this.getTasks();
      });
    },

    // 处理完成选择
    handleSeletChange (item) {
      this.addTaskForm = item;
      this.handleUpdateTask();
    },
    //  处理是否为重要事项改变
    handleStarClick (item) {
      this.addTaskForm = item;
      this.addTaskForm.isImportant = !this.addTaskForm.isImportant;
      this.handleUpdateTask();
    },

    //处理底部弹窗事件
    handleIsShow () {
      this.isShow = !this.isShow;
    },

    handleIsDone () {
      this.isDone = !this.isDone;
      console.log(1);
    },
    handleIsImportant () {
      this.isImportant = !this.isImportant;
      Taro.atMessage({ message: "修改成功", type: "succcess", duration: 1000 });
      console.log(1);
    }
  }
}

</script>
