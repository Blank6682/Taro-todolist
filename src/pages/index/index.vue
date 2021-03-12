<template>
  <view class="todolist-warp">
    <!-- 顶部导航 -->

    <view class="navbar-warp">
      <AtNavBar color="#000" left-icon-type="close" />
    </view>

    <!-- 标题 -->
    <view class="title-warp">
      <view class="title-content"> ToDo list </view>
      <view class="title-time">
        {{ getTimeData() }}
      </view>
    </view>

    <!-- 列表 -->
    <view class="list-warp">
      <!--没有任务提醒-->
      <view v-if="todoList.length <= 0" class="no-data-tips">
        <view>
          <AtIcon value="calendar" size="80" />
        </view>

        <text>没有待办</text>
      </view>

      <!-- 任务列表 -->

      <view v-for="item in todoList" :key="item.id" class="task-list">
        <view class="task-item">
          <!-- 左边任务 -->
          <view class="task-item-left">
            <view @tap="handleSeletChange(item)">
              <checkbox :value="item.isDone" :checked="item.isDone" />
            </view>
            <view
              :class="item.isDone ? 'task-item-done-name' : 'task-item-name'"
              @tap="handleIsEdit(item)"
            >
              {{ item.name }}
            </view>
          </view>

          <!-- 右边图标 -->
          <view class="task-item-right">
            <view :disabled="!item.isDone" @tap="handleStarClick(item)">
              <AtIcon
                :value="item.isImportant ? 'star-2' : 'star'"
                :style="{
                  color: item.isImportant ? 'red' : '#c0c0c0',
                }"
                size="20"
              />
            </view>

            <AtIcon value="trash" size="20" :on-click="handleIsDelete" />
          </view>
        </view>
        <!-- 是否删除弹窗 -->
        <view v-if="isDelete" class="popup-delete">
          <view class="popup-delete-title"> 是否要删除该任务? </view>
          <view class="popup-delete-btn">
            <button @tap="handleIsDelete">取消</button>
            <button type="primary" @tap="handleDelete(item.id)">确认</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部添加任务 -->
    <view class="addTask-warp">
      <button @tap="handleIsShow">
        <AtIcon value="add" size="20" color="#c0c0c0" /> 添加任务
      </button>
    </view>

    <!-- 底部添加任务弹窗 -->
    <view class="popup-warp">
      <AtFloatLayout
        v-if="show"
        is-opened
        :title="isAdd ? '添加' : '编辑'"
        :on-close="handleIsShow"
      >
        <AtForm>
          <AtInput
            name="addTaskForm.name"
            title="待办事项"
            type="text"
            placeholder="请输入待办事项"
            :value="addTaskForm.name"
            :on-change="handleInputName"
          />
          <AtInput
            name="addTaskForm.remark"
            title="备注"
            type="text"
            placeholder="请输入备注"
            :value="addTaskForm.remark"
            :on-change="handleInputRemark"
          />
          <view class="popup-isDone">
            <text>已完成：</text>
            <radio-group @change="handleChooseIsDone">
              <radio :value="true" :checked="addTaskForm.isDone"> 是 </radio>
              <radio :value="false" :checked="!addTaskForm.isDone"> 否 </radio>
            </radio-group>
          </view>
          <view class="popup-isImportant">
            <text>重要事项：</text>
            <radio-group @change="handleChooseIsImportant">
              <radio :value="true" :checked="addTaskForm.isImportant">
                是
              </radio>
              <radio :value="false" :checked="!addTaskForm.isImportant">
                否
              </radio>
            </radio-group>
          </view>
          <view class="popup-btn-save">
            <button
              type="primary"
              form-type="subimt"
              :disabled="!addTaskForm.name"
              @tap="handleAddTask"
            >
              保存
            </button>
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
      show: false,
      isAdd: true,
      addTaskForm: {
        name: "",
        isDone: false,
        isImportant: false,
        remark: ""
      },
      todoList: []
    }
  },
  onLoad () {
    this.getTasks()
  },
  methods: {
    //获取当前时间
    getTimeData () {
      return dayjs(new Date()).format("YYYY/MM/DD");
    },
    //获取任务列表
    getTasks () {
      getTaskList().then((res) => {
        this.todoList = res.data;
        // console.log(this.todoList);
      })
    },
    // 清空输入对象
    clearAddTaskForm () {
      this.addTaskForm = {
        name: "",
        isDone: false,
        isImportant: false,
        remark: ""
      }
    },
    //处理底部弹窗事件
    handleIsShow () {
      this.show = !this.show;
      this.clearAddTaskForm();
    },
    //处理交互事件
    handleInputName (name) {
      this.addTaskForm.name = name;

    },
    handleInputRemark (remark) {
      this.addTaskForm.remark = remark;
    },
    handleChooseIsDone (isDone) {
      this.addTaskForm.isDone = Boolean(isDone.detail.value);

    },
    handleChooseIsImportant (isImportant) {
      this.addTaskForm.isImportant = Boolean(isImportant.detail.value);
    },

    //处理添加任务
    handleAddTask () {
      if (this.isAdd) {
        addTask(this.addTaskForm)
          .then((res) => {
            if (res) {
              this.handleIsShow();
              this.getTasks();
            }
          }).catch((err) => {
            console.log(err)
          })
      } else {
        this.handleUpdateTask();
      }
    },

    // 处理编辑
    handleIsEdit (item) {
      this.show = true;
      this.isAdd = false;
      this.addTaskForm = JSON.parse(JSON.stringify(item));
    },

    // 处理删除事项
    handleIsDelete () {
      this.isDelete = !this.isDelete;
    },
    handleDelete (id) {
      deleteTask(id).then((res => {
        if (res) {
          this.getTasks();
          this.isDelete = !this.isDelete;
        }
      })).catch((err) => { console.log(err); });
    },

    //处理保存更新
    handleUpdateTask () {
      updateTask(this.addTaskForm).then(() => {
        this.isAdd = true;
        this.show = false;
        //更新显示列表
        this.getTasks();
        this.clearAddTaskForm();
      }).catch((err) => { console.log(err); });
    },

    // 处理完成选择
    handleSeletChange (item) {
      this.addTaskForm = item;
      this.addTaskForm.isDone = !this.addTaskForm.isDone;
      this.handleUpdateTask();
    },
    //  处理是否为重要事项改变
    handleStarClick (item) {
      this.addTaskForm = item;
      this.addTaskForm.isImportant = !this.addTaskForm.isImportant;
      this.handleUpdateTask();
    },
  }
}

</script>
