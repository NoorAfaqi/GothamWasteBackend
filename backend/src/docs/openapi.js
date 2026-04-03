/**
 * OpenAPI 3.0 specification for Gotham Waste backend.
 */
const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Gotham Waste Backend API",
    description:
      "REST API for smart bin data stored in Firebase Realtime Database under `Bins/*`.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Current host (local or Vercel)",
    },
  ],
  tags: [
    { name: "Root", description: "Service metadata" },
    { name: "Health", description: "Configuration and readiness" },
    { name: "Bins", description: "Bin CRUD under Realtime Database `Bins`" },
    { name: "Logs", description: "Log operations under Realtime Database `Logs`" },
  ],
  paths: {
    "/": {
      get: {
        tags: ["Root"],
        summary: "Service info",
        operationId: "getRoot",
        responses: {
          200: {
            description: "Links to main endpoints",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RootResponse" },
                example: {
                  service: "gotham-waste-backend",
                  health: "/health",
                  bins: "/api/bins",
                  logs: "/api/logs",
                  apiDocs: "/api-docs",
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health and Firebase readiness",
        operationId: "getHealth",
        responses: {
          200: {
            description: "Status payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/bins": {
      get: {
        tags: ["Bins"],
        summary: "List all bins",
        description: "Returns the `Bins` object from Realtime Database.",
        operationId: "getAllBins",
        responses: {
          200: {
            description: "Bins object keyed by bin name",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinsListSuccess" },
              },
            },
          },
          404: {
            description: "No bins data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Bins"],
        summary: "Update multiple bins",
        description:
          "Body keys are bin names (e.g. `Bin1`); values are written to `Bins/{name}` in one multi-path update.",
        operationId: "patchManyBins",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BinBulkUpdateBody" },
              example: {
                Bin1: { binStatus: "full" },
                Bin2: { binStatus: "empty" },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinBulkUpdateSuccess" },
              },
            },
          },
          400: {
            description: "Empty body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
    },
    "/api/bins/{binName}": {
      get: {
        tags: ["Bins"],
        summary: "Get one bin",
        operationId: "getBin",
        parameters: [
          {
            name: "binName",
            in: "path",
            required: true,
            schema: { type: "string", example: "Bin1" },
            description: "Bin key under `Bins` (e.g. Bin1, Bin2)",
          },
        ],
        responses: {
          200: {
            description: "Bin value",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinOneSuccess" },
              },
            },
          },
          404: {
            description: "Bin missing or null",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Bins"],
        summary: "Replace one bin value",
        description:
          "Sets `Bins/{binName}` to the provided `value` (object, string, number, etc.).",
        operationId: "putBin",
        parameters: [
          {
            name: "binName",
            in: "path",
            required: true,
            schema: { type: "string", example: "Bin1" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BinUpdateBody" },
              examples: {
                object: {
                  summary: "Object payload",
                  value: { value: { binStatus: "full" } },
                },
                string: {
                  summary: "String payload",
                  value: { value: "full" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinUpdateSuccess" },
              },
            },
          },
          400: {
            description: "Missing `value` in body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
    },
    "/api/logs": {
      get: {
        tags: ["Logs"],
        summary: "List all logs",
        operationId: "getAllLogs",
        responses: {
          200: {
            description: "Logs keyed by push id",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogsListSuccess" },
              },
            },
          },
          404: {
            description: "No logs found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Logs"],
        summary: "Create one log entry",
        description:
          "Creates a log under `Logs/{pushKey}`. Stored shape is `{ timestamp, status }` where status becomes `\"{binName} is {status}\"`.",
        operationId: "createLog",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogCreateBody" },
              examples: {
                status: {
                  value: { binName: "Bin1", status: "full" },
                },
                binStatus: {
                  value: { binName: "Bin1", binStatus: "full" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogCreateSuccess" },
              },
            },
          },
          500: {
            description: "Validation/server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
    },
    "/api/logs/{logId}": {
      delete: {
        tags: ["Logs"],
        summary: "Delete one log by push key",
        operationId: "deleteLog",
        parameters: [
          {
            name: "logId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Firebase push key under `Logs`",
          },
        ],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogDeleteSuccess" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Logs"],
        summary: "Patch one log by push key",
        operationId: "patchLog",
        parameters: [
          {
            name: "logId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Firebase push key under `Logs`",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogPatchBody" },
              example: { status: "Bin1 is empty" },
            },
          },
        },
        responses: {
          200: {
            description: "Patched",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogPatchSuccess" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BinError" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RootResponse: {
        type: "object",
        properties: {
          service: { type: "string" },
          health: { type: "string" },
          bins: { type: "string" },
          logs: { type: "string" },
          apiDocs: { type: "string" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["ok", "degraded"] },
          service: { type: "string" },
          firebase: { type: "object", additionalProperties: true },
          rtdb: { type: "object", additionalProperties: true },
          readyForBinWrites: { type: "boolean" },
          mockFirebase: { type: "boolean" },
          firebaseWriteTimeoutMs: { type: "integer" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      ErrorMessage: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      BinError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
      BinsListSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            additionalProperties: true,
            description: "Map of binName → stored value",
          },
        },
      },
      BinOneSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            additionalProperties: true,
            description: "Single key: binName → value",
          },
        },
      },
      BinUpdateBody: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            description: "Stored as the entire node at Bins/{binName}",
            oneOf: [
              { type: "object", additionalProperties: true },
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
            ],
          },
        },
      },
      BinUpdateSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
      BinBulkUpdateBody: {
        type: "object",
        additionalProperties: true,
        minProperties: 1,
        description: "Each property name is a bin name; value is written to Bins/{name}",
        example: { Bin1: { binStatus: "full" } },
      },
      BinBulkUpdateSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
      },
      LogsListSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            additionalProperties: {
              type: "object",
              properties: {
                timestamp: { type: "string", example: "2026/04/03 10:22:01:1230" },
                status: { type: "string", example: "Bin1 is full" },
              },
            },
          },
        },
      },
      LogCreateBody: {
        type: "object",
        required: ["binName"],
        properties: {
          binName: { type: "string", example: "Bin1" },
          status: { type: "string", example: "full" },
          binStatus: { type: "string", example: "full" },
        },
        description: "Provide `status` or `binStatus`.",
      },
      LogCreateSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Log created" },
          data: {
            type: "object",
            properties: {
              logId: { type: "string" },
              log: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  timestamp: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
      },
      LogDeleteSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Log deleted" },
          data: {
            type: "object",
            properties: {
              logId: { type: "string" },
            },
          },
        },
      },
      LogPatchBody: {
        type: "object",
        additionalProperties: true,
        description: "Fields to patch on a log node.",
      },
      LogPatchSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Log patched" },
          data: {
            type: "object",
            properties: {
              logId: { type: "string" },
            },
          },
        },
      },
    },
  },
};

module.exports = openApiSpec;
