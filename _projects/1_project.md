---
lang: en
translation_key: project_1
permalink_en: /projects/1_project/
permalink_zh: /zh/projects/1_project/
title_zh: MulDet3D
description_zh: 基于多目标优化的多路侧激光雷达无监督目标检测
layout: page
title: MulDet3D
description: Multi-Objective Optimization Based Unsupervised Object Detection for Multiple Roadside LiDARs
importance: 1
category: LiDAR
---

**Status:** Accepted at _Journal of Transportation Engineering Part A: Systems_

Roadside LiDAR systems offer a promising infrastructure-based approach for traffic monitoring, but detecting objects across multiple sensors with varying fields of view remains challenging — especially without labeled training data.

**MulDet3D** proposes an unsupervised object detection framework that jointly optimizes detection accuracy and computational efficiency across multiple roadside LiDARs. Key contributions include:

- A multi-objective optimization formulation that balances detection performance across overlapping and non-overlapping sensor zones
- An unsupervised pipeline that eliminates the need for manually annotated 3D bounding boxes
- Robust handling of sparse point clouds typical in roadside (infrastructure-side) deployments

This work addresses a critical gap in infrastructure-based sensing for intelligent transportation systems, enabling scalable deployment without costly labeling efforts.
