<template>
  <div v-if="visible" class="user-card-overlay">
    <div class="user-card" @click.stop>
      <div class="info-part">
        <div class="icon-user icon-avatar"></div>
        <div class="info-group">
          <div class="icon-email icon-info"></div>
          <h2 class="text-type">邮箱：</h2>
          <h2 class="text-value">{{ user_info.email }}</h2>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="separator"></div>
      <div class="opera-part">
        <button class="to-button-base button-opera">忘记密码</button>
        <button class="to-button-base button-opera">修改密码</button>
        <button class="to-button-base button-opera">注销登录</button>
        <button class="button-base user-card-close" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default
{
  mounted()
  {
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount()
  {
    document.removeEventListener('keydown', this.handleKeydown);
  },

  computed:
      {
        ...mapGetters(['getUserInfo']),
        user_info()
        {
          return this.getUserInfo;
        }
      },

  props:
      {
        visible: { type: Boolean, required: true, default: false }
      },

  methods:
      {
        close()
        {
          this.$emit('close');
        },

        handleKeydown(event)
        {
          if (event.key === 'Escape')
            this.close();
        }
      }
}
</script>

<style scoped>
.user-card-overlay
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-mask);
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-card
{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: var(--color-base);
  width: 500px;
  height: 300px;
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.info-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 60%;
  height: 100%;
  padding: 20px;
  border-radius: var(--border-radius);
}

.icon-avatar
{
  background-size: cover;
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.info-group
{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.icon-info
{
  background-size: cover;
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.text-type
{
  text-align: center;
  font-size: 15px;
}

.text-value
{
  text-align: center;
  font-size: 15px;
  font-weight: normal;
}

.opera-part
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 25%;
  height: 100%;
  padding: 20px;
  border-radius: var(--border-radius);
}

.button-opera
{
  font-size: 16px;
  margin-bottom: 15px;
}

.button-opera::after
{
  height: 7.5%;
}

.button-opera:hover::after
{
  transform: scaleX(0.9);    /* 鼠标移至按钮时显示下划线 */
}

.separator
{
  width: 0.5%;
  height: 100%;

  margin: 2.5% 2.5%; /* 设置上下的边距 */
  background-color: var(--color-fill);
}

.user-card-close
{
  padding: 8px 30px;
  transform: translateY(200%);
}
</style>