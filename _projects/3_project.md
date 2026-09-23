---
lang: en
translation_key: project_3
permalink_en: /projects/3_project/
permalink_zh: /zh/projects/3_project/
title_zh: MulTrack3D
description_zh: 面向多路侧激光雷达的可靠性增强自校正多点跟踪
layout: page
title: MulTrack3D
description: Reliability-Enhanced Self-Correcting Multi-Point Tracking for Multiple Roadside LiDARs
importance: 3
category: LiDAR
---

**Status:** Under Review at _Journal of Transportation Engineering Part A: Systems_

Accurate multi-object tracking across multiple roadside LiDAR sensors is essential for intersection management, traffic flow analysis, and safety assessment. Sensor handoff errors and occlusions make this particularly challenging in real-world deployments.

**MulTrack3D** proposes a reliability-enhanced tracking framework that self-corrects tracking errors across multiple LiDAR sensors. Key contributions include:

- A reliability-aware data association mechanism that weights detections by sensor confidence
- A self-correction module that leverages cross-sensor consistency to recover from tracking failures
- Seamless multi-LiDAR handoff for continuous vehicle trajectory estimation

This framework is designed for practical deployment on roadside infrastructure, supporting applications from traffic signal control to autonomous vehicle situational awareness.
