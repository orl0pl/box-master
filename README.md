Box Master
=====================

This repository contains a Box Master System built with TypeScript. The system is designed to manage a collection of boxes and their relationships, allowing you to add new boxes, delete existing ones, and view the hierarchy of boxes.

Core
----

The `core.ts` file contains the core functionality of the Box Master. It defines the `Box` interface and provides functions for manipulating boxes in the system.

CLI
---

The `cli.ts` file contains a simple CLI interface for interacting with the Box Master. It imports the core functionality from `core.ts` and allows you to add new boxes, delete existing ones, and print a tree structure of all boxes.

Note that the CLI is currently broken and may not work correctly.

To start the CLI, run the following command:
```shell
nodemon cli.ts
```

Plans for Express API
---------------------

In the future, we plan to build an Express API for the Box Master. This API will provide a more robust interface for managing boxes and allow for integration with other applications.

Some possible features of the Express API include:

*   CRUD operations for boxes
*   User authentication and authorization
*   Support for multiple users and organizations
*   Integration with third-party services such as Dropbox or Google Drive

We will update this README as development progresses and more details become available.
