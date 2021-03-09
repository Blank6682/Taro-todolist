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
      <view class="title-time"> 时间 </view>
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
          <checkbox class="task-list-done" :checked="item.isDone" />
          <view class="task-list-item-name">
            {{ item.name }}
          </view>
          <text>{{ item.isDone ? "已完成" : "正在进行" }}</text>
          <!-- 重要事项图标 -->
          <AtIcon
            :on-click="handleIsImportant"
            :value="item.isImportant ? 'star-2' : 'star'"
            :color="item.isImportant ? 'red' : ''"
            size="30"
          />
        </view>
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
            name="name"
            title="待办事项"
            type="text"
            placeholder="请输入待办事项"
            :value="addTaskForm.name"
          />
          <AtInput
            name="remark"
            title="备注"
            type="password"
            placeholder="请输入备注"
            :value="addTaskForm.remark"
          />
          <view class="popup-isDone">
            <text>已完成：</text>
            <radio-group class="isDone">
              <radio :value="true"> 是 </radio>
              <radio :value="false" checked="true"> 否 </radio>
            </radio-group>
          </view>
          <view class="popup-isImportant">
            <text>重要事项：</text>
            <radio-group :on-change="handleIsImportant" class="isImprotant">
              <radio :value="true"> 是 </radio>
              <radio :value="false" checked="true"> 否 </radio>
            </radio-group>
          </view>
          <view class="popup-btn-save">
            <button type="primary">保存</button>
          </view>
        </AtForm>
      </AtFloatLayout>
    </view>
  </view>
</template>

<script>
// 按需引入, 更小的应用体积
import { AtInput, AtForm, AtIcon, AtNavBar, AtFloatLayout } from "taro-ui-vue"
import "taro-ui-vue/dist/style/components/icon.scss"
import "taro-ui-vue/dist/style/components/flex.scss"
import "taro-ui-vue/dist/style/components/nav-bar.scss"
import "taro-ui-vue/dist/style/components/action-sheet.scss"
import "taro-ui-vue/dist/style/components/input.scss"
import "taro-ui-vue/dist/style/components/float-layout.scss"
import './index.scss'
export default {
  components: {
    AtFloatLayout,
    AtIcon,
    AtNavBar,
    AtInput,
    AtForm
  },
  data () {
    return {
      isDone: false,
      isShow: false,
      addTaskForm: [{
        name: "",
        isDone: false,
        isImportant: false,
        remark: ""
      }],
      todoList: []
    }
  },
  methods: {
    //处理底部弹窗事件
    handleIsShow () {
      this.isShow = !this.isShow;
    },
    handleIsDone () {
      this.isDone = !this.isDone;
      console.log(this.isDone);
    },
    handleIsImportant () {
      this.isImportant = !this.isImportant;
      console.log(this.isImportant);
    }
  }
}

</script>
