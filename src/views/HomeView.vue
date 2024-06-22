<template>
  <div class="home">
    <div class="section section-intro">
      <h1>问卷鑫</h1>
      <h2>便捷、高效的问卷创作与共享平台</h2>
    </div>
    <div class="section section2">
      <div class="Title-RD-Team">开发团队</div>

      <div class="team-members">
        <div class="member">
          <div class="member-photo member-1-photo"></div>
          <div class="member-info">
            <div class="member-name">王鑫</div>
            <div class="member-title">前端开发工程师</div>
            <div class="member-subtitle">Frontend Engineer</div>
          </div>
        </div>
        <div class="member">
          <div class="member-photo member-2-photo"></div>
          <div class="member-info">
            <div class="member-name">朱炜豪</div>
            <div class="member-title">项目总监</div>
            <div class="member-subtitle">Project Director</div>
          </div>
        </div>
        <div class="member">
          <div class="member-photo member-3-photo"></div>
          <div class="member-info">
            <div class="member-name">王飞骐</div>
            <div class="member-title">后端开发工程师</div>
            <div class="member-subtitle">Backend Engineer</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section section3">
      <div class="container">
        <img src="@/assets/demo.png" alt="3D Corner View Image" class="image-3d">
        <div class="description">
          <p>我们提供了轻松上手的问卷创作与共享功能，能够帮助您快速收集和分析数据。</p>
          <a href="/quest" class="experience-button">立即体验</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home
{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  z-index: -1;
}

.section
{
  padding: 20px;
  text-align: center;
}

.section-intro
{
  position: relative;
  /* 添加渐变背景 */
  background-image: var(--image-background-home), linear-gradient(to bottom right, white, lightblue);
  background-size: 80% 80%, cover; /* 设置渐变背景覆盖整个容器，背景图片固定大小 */
  background-repeat: no-repeat, no-repeat; /* 确保背景图片和渐变背景都不重复 */
  background-position: center, center; /* 背景图片和渐变背景都居中对齐 */
  height: 100vh;
  min-height: 500px;
  min-width: 900px;
  color: white;
  margin-top: -20px;
  overflow: hidden;
}

.section-intro h1
{
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-family: 微软雅黑, monospace;
  font-size: 6.5em;
  text-shadow: 3px 3px 5px var(--color-mask);
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: #ffffff;
  font-weight: 600;
  -webkit-text-stroke: 1px #62f5c9; /* 添加描边 */
}

.section-intro h2
{
  position: absolute;
  top: 63%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font: menu;
  font-family: 华文宋体, monospace;
  font-size: 2.7em;
  font-weight: 600;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: #ffffff;
}

.section2
{
  height: 600px;
  min-width: 900px;
  background-color: #ffffff;
  padding: 40px 20px;
}

.Title-RD-Team
{
  font-size: 4em;
  font-weight: 600;
  margin-top: 60px;
  margin-bottom: 90px;
  text-align: center;
}

.team-members
{
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.member
{
  text-align: center;
}

.member-photo
{
  width: 200px;
  height: 200px;
  background-color: #ccc; /* 占位符颜色 */
  border-radius: 50%;
  margin-bottom: 25px;
  transition: transform 0.5s ease;    /* 添加平滑过渡效果 */
}

.member-photo:hover
{
  transform: rotate(360deg);    /* 鼠标悬停时旋转180度 */
}

.member-info
{
  text-align: center;
}

.member-name
{
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.member-title
{
  font-size: 1.1em;
  color: #666;
}

.member-subtitle
{
  font-family: "Cascadia Mono", monospace;
  font-size: 1em;
  color: #999;
}

.member-1-photo
{
  background-image: var(--image-member-1);
  background-size: cover;
  background-position: center;
}

.member-2-photo
{
  background-image: var(--image-member-2);
  background-size: cover;
  background-position: center;
}

.member-3-photo
{
  background-image: var(--image-member-3);
  background-size: cover;
  background-position: center;
}

.section3
{
  height: 100vh;
  min-width: 900px;
  background-color: #ffffff;
}

.container {
  display: flex;
  justify-content: center;
  margin-top: -20px;
  align-items: center;
  height: 100vh;
  perspective: 1000px; /* 添加透视效果 */
}

.image-3d {
  width: 800px;
  height: 500px;
  border-radius: 10px;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s, box-shadow 0.5s;
  transform: rotateX(25deg) rotateY(-15deg) rotate(5deg); /* 初始旋转角度 */
}

.image-3d:hover {
  transform: rotateX(0deg) rotateY(0deg) translateY(-10px);
  box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.3);
}

.description {
  margin-left: 130px;
  max-width: 300px;
  min-width: 300px;
  text-align: left;
}

.description p {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

.experience-button {
  display: inline-block;
  margin-top: 50px;
  padding: 20px 50px;
  font-size: 1.5em;
  color: white;
  background: linear-gradient(to right, #00BFFF, #1E90FF); /* 悬停时的渐变色 */

  border: none;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.3s;
}

.experience-button:hover {
  background: linear-gradient(to right, #87CEEB, #00BFFF); /* 天蓝渐变色 */
}
</style>
