---
layout: page
lang: zh-CN
translation_key: project_3
permalink: /zh/projects/3_project/
permalink_en: /projects/3_project/
permalink_zh: /zh/projects/3_project/
title: MulTrack3D
description: 面向多路侧激光雷达的可靠性增强自校正多点跟踪
---

**状态：** _Journal of Transportation Engineering Part A: Systems_ 审稿中

跨多个路侧激光雷达的准确多目标跟踪，是交叉口管理、交通流分析与安全评估的基础。实际部署中的传感器交接误差与遮挡增加了这一任务的难度。

**MulTrack3D** 提出可靠性增强跟踪框架，以自校正方式处理跨传感器跟踪误差：

- 依据传感器置信度对检测结果加权，实现可靠性感知的数据关联
- 利用跨传感器一致性，从跟踪失败中恢复
- 支持多激光雷达之间的连续交接与车辆轨迹估计

框架面向实际路侧部署，可服务于交通信号控制和自动驾驶态势感知等应用。
