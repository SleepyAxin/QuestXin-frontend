<!-- src/components/Header.vue -->
<template>
  <header :class="{ hidden: isHidden }">
    <div class="left-box">
      <div class="img-logo" @click="toHome"></div>
      <button class="web-title" @click="toHome">问卷鑫</button>
    </div>
    <div v-if="user_info !== null" class="right-box">
      <div v-if="this.$route.name !== 'quest'" class="container">
        <span class="icon-user icon"></span>
        <button class="to-button-base button" @click="toQuest">问卷管理</button>
      </div>
      <div class="blank"></div>
      <div class="container">
        <span class="icon-user icon"></span>
        <button class="to-button-base button" @click="showUserCard">用户信息</button>
      </div>
    </div>
    <div v-else class="right-box">
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': this.$route.name === 'login'}"
                @click="toLogin">登录</button>
      </div>
      |
      <div class="group">
        <button class="to-button-base to-auth-button"
                :class="{'active-link': this.$route.name === 'register'}"
                @click="toRegister">注册</button>
      </div>
    </div>
  </header>
  <UserCard
      v-if="user_card_show"
      @close="closeUserCard"
      visible></UserCard>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserCard from "@/components/UserCard.vue";
import Router from '@/components/js/Router.js';
import Cookie from '@/components/js/Cookie.js';

export default {
  data() {
    return {
      user_card_show: false,
      isHidden: false,
      lastScrollPosition: 0,
    };
  },
  created() {
    this.checkUserInfo();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  components: { UserCard },
  mixins: [Router],
  computed: {
    ...mapGetters(['getUserInfo']),
    user_info() {
      return this.getUserInfo;
    }
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    checkUserInfo() {
      this.updateUserInfo(Cookie.getUserInfoFromCookie());
    },
    showUserCard() {
      if (this.user_info !== null) {
        this.user_card_show = true;
        window.removeEventListener('scroll', this.handleScroll);
      }
    },
    closeUserCard() {
      this.user_card_show = false;
      window.addEventListener('scroll', this.handleScroll);
    },
    handleScroll() {
      const currentScrollPosition = window.pageYOffset;

      if (currentScrollPosition > this.lastScrollPosition) {
        // 向下滚动，隐藏header
        this.isHidden = true;
      } else {
        // 向上滚动，显示header
        this.isHidden = false;
      }

      this.lastScrollPosition = currentScrollPosition;
    }
  }
};
</script>

<style>
@import url("@/components/css/Style.css");
@import url("@/components/css/Variable.css");

header {
  padding: 10px;
  margin-top: 8px;
  margin-left: 8px;
  margin-right: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-base);
  border-radius: var(--border-radius);
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 16px); /* 减去左右 margin */
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
}

header.hidden {
  transform: translateY(-100%);
}

.left-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  margin-left: 1%;
}

.img-logo {
  background: var(--image-logo) no-repeat;
  background-size: cover;
  width: 30px;
  height: 30px;
}

.web-title {
  background-color: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
}

.right-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 1%;
  border-radius: var(--border-radius);
  font-size: 20px;
  font-weight: bold;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.blank {
  width: 5px;
}

.icon {
  background-size: cover;
  width: 25px;
  height: 25px;
}

.button {
  font-size: 15px;
  font-weight: bold;
}

.button::after {
  height: 10%;
}

.button:hover::after {
  transform: scaleX(0.9);
}

.to-auth-button {
  font-size: 15px;
  font-weight: bold;
  position: relative;
}

.to-auth-button::after {
  height: 10%;
}

.to-auth-button:hover::after {
  transform: scaleX(0.8);
}

.active-link {
  color: var(--color-fill);
}
</style>
