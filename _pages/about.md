---
permalink: /
title: "About Me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---
{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "<https://cdn.jsdelivr.net/gh/>" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "<https://raw.githubusercontent.com/>" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi, I'm Chenhuan Cai. Thanks for visiting my website!



# Updates

- _2022.07_: &nbsp;🤖🛺 我在日内瓦参加2023苏黎世联邦理工学院RobotX夏令营，尝试使用移动机器人探索复杂环境！



<span class='anchor' id='educations'></span>

# Educations


- _2023.09 - present_, M.Sc. in Informatics, **University of Zurich**, Switzerland
- _2019.09 - 2023.06_, B.Sc. in Data Science and Big Data Technology, **Harbin Institute of Technology (Shenzhen)**, China


<span class='anchor' id='experiences'></span>

# Experiences


<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/GSICP_LVIO.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[项目 – 基于高斯溅射的雷达-视觉-惯性里程计（LVIO）]()

- 将雷达数据和RGB数据融合为统一的高斯点云，与全局高斯点云进行比较，通过最大似然估计来实现里程计
- 结合GTSAM优化器实现了基于数据融合的LVIO，相较其他基于深度相机的GS-SLAM方案大大提升了定位精度和重建质量

</div>
</div>





<span class='anchor' id='competitions-and-projects'></span>

# Projects & Researches


<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/GSICP_LVIO.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[项目 – 基于高斯溅射的雷达-视觉-惯性里程计（LVIO）]()

- 将雷达数据和RGB数据融合为统一的高斯点云，与全局高斯点云进行比较，通过最大似然估计来实现里程计
- 结合GTSAM优化器实现了基于数据融合的LVIO，相较其他基于深度相机的GS-SLAM方案大大提升了定位精度和重建质量

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/500x300.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[硕士项目 – 纯RGB的零样本（zero-shot）物体6D姿态估计及三维重建]()

- 针对相机固定+运动物体的场景跟踪物体，进行6D姿态估计，并基于预测姿态进行几何模型重建或新视角生成
- 基于带有尺度误差和噪声的单目深度估计模型，通过鲁棒优化器实现仅有RGB输入的物体6D位姿估计（C++）
- 通过训练NeRF或者高斯溅射模型，对带有尺度噪声的物体点云、位姿和尺度进行全局优化，实现物体三维重建与新视角生成

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/3DV_Project.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[项目 – 基于NeRF对VR头戴相机进行图像稳定]()

- 在“Depth-Supervised NeRF”的基础上对其流程进行修改和拓展，从而使用深度先验来重建室内环境
- 实现“Deblur-NeRF”, 通过运动先验来对带有运动模糊的输入图像进行去噪声学习，在VR中渲染模型来实现图像稳定
- 在只使用有限的训练视角且输入图像有运动噪声的情况下，对卧室环境达到了相对较好的三维重建质量

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/EMP_Compress.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[本科毕业设计 – 基于隐式神经表示的医疗显微图像压缩算法]()

- 设计了Embedding-MLP-PixelShuffle 架构来对高分辨率医疗显微图像进行压缩，并对神经表示进行低秩正则化
- 部署了一套基于隐式神经表示的超分辨率算法在接收端对解压后的图像进行还原（对应发送端的初步压缩）
- 在压缩率为0.2-0.7区间时，实现了接近于JPEG2000算法的 BPP-PSNR 和 BPP-MSSSIM 表现

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/CTR_System.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[本科毕业设计 – 用于微创手术的多臂同心管机器人]()

- 实现了完整功能的多臂同心管微创手术机器人。包括机械设计，动力学建模，同心管臂标定以及多臂同心管机器人系统标定
- 设计了同心管机械臂的标定算法与基于视觉的连续体机器人末端视觉标签的6D姿态估计算法（C++）
- 在实现了臂与臂之间运动独立的同时，达到了一个更靠近中心轴线的臂间根部分布（臂与臂之间的距离足够小）

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/Logistic_Car.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[工程能力综合训练大赛 - 四轮物料搬运机器人]()

- 四轮物料搬运机器人，有夹取、搬运、放置功能，通过IMU传感器和巡线功能将物料从原料区搬运到加工区再搬运到成品区
- 实时视觉处理，使用OpenMV4相机来区分不同颜色的物料，并实现将物料放到对应颜色的圆环的正中心

</div>
</div>



<div class='paper-box'>
<div class='paper-box-image'><div>
        <!-- <div class="badge">CVPR 2016</div> -->
        <img src='images/RM_Embedding.png' alt="sym" width="100%">
</div></div>

<div class='paper-box-text' markdown="1">

[全国机器人大赛 - 机器人嵌入式开发]()

- 设计并实现了面向对象的嵌入式机器人代码框架，南工骁鹰机器人队开源代码框架的初代版本编写者
- 2020赛季工程机器人整车模块化代码编写，实现了基于状态机的一键取弹及补给

</div>
</div>




<span class='anchor' id='miscellaneous'></span>

# Others


- _2019 - 2021_ 哈尔滨工业大学（深圳）南工骁鹰机器人队，担任队长/副队长
- _2019_ 哈尔滨工业大学（深圳）机电学院羽毛球队，院系杯团体第三名
- _2019_ 哈尔滨工业大学（深圳）机电学院机械系足球队第16届足球赛冠军，担任队长
