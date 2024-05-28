<template>
  <div class="home">
    <div class="section section-intro">
      <h1>问卷鑫</h1>
      <h2>便捷、高效的问卷创作与共享平台</h2>
    </div>
    <div class="section section2">
      <p>Content for the second section goes here.</p>
    </div>
    <div class="section section3">
      <p>Content for the third section goes here.</p>
    </div>
  </div>
</template>

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
  background-size: 80% 80%, cover;    /* 设置渐变背景覆盖整个容器，背景图片固定大小 */
  background-repeat: no-repeat, no-repeat;    /* 确保背景图片和渐变背景都不重复 */
  background-position: center, center;    /* 背景图片和渐变背景都居中对齐 */

  height: 100vh;

  color: white;
  margin-top: -20px;
  overflow: hidden;
}

.section-intro h1
{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font: menu;
  font-size: 6em;
  text-shadow: 2px 2px 4px var(--color-mask);
  white-space: nowrap;
}

.section-intro h2
{
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-size: 3em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.section2
{
  background-color: #f4f4f4;
}

.section3
{
  background-color: #e2e2e2;
}
</style>
