# ComfyUI Custom Nodes Dataset

## Purpose

This folder contains a comprehensive dataset of all ComfyUI custom nodes available in the official registry, collected from the ComfyUI API. The data is sorted by popularity (download count) to help identify the most useful and widely-adopted community extensions.

## What This Data Represents

- **Source**: ComfyUI Registry API (https://api.comfy.org/nodes)
- **Collection Date**: June 17, 2025
- **Total Nodes**: 2,654 custom node packages
- **Data Completeness**: 97.6% complete records
- **Sort Order**: By download count (highest to lowest)

Each node record contains:
- **Name**: Package identifier
- **Description**: Functionality overview
- **Repository URL**: GitHub source code location
- **Download Count**: Total installations across all versions

## Files in This Folder

### Data Files
- **`nodes_data.json`** (787 KB) - Complete dataset in JSON format
- **`nodes_data.db`** (922 KB) - SQLite database with indexes for fast queries
