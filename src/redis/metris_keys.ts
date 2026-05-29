// types/metrics.ts

export const METRIC_KEYS = {
  MAINQUEUE: {
    QUEUE_SIZE: "mainqueue:queue_size" as const,
  },

  PROCESSOR: <T extends string>(name: T) => ({
    PROCESSING_COUNT: `processor:${name}:processing_count` as const,
    PROCESSING_ERROR_COUNT: `processor:${name}:processing_error_count` as const,
    PROCESSOR_ACTIVE: `processor:${name}:active` as const,
  }),
};

// Optional helper type if you want to extract the shape
export type ProcessorMetricKeys = ReturnType<typeof METRIC_KEYS.PROCESSOR>;
