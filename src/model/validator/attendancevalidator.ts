import { z } from 'zod';

export const ZAttendanceTable = z.array(
  z.object({
    divID: z.number(),
    divName: z.string(),
    kakariID: z.number(),
    kakariDesc: z.string(),
    koutaiInCount: z.number(),
    koutaiTotalCount: z.number(),
    koutaiPercent: z.preprocess(
      (x) => Number(x),
      z.coerce.number({ invalid_type_error: 'should be a number' }),
    ),
    dayShiftInCount: z.number(),
    dayShiftTotalCount: z.number(),
    dayShiftPercent: z.preprocess(
      (x) => Number(x),
      z.coerce.number({ invalid_type_error: 'should be a number' }),
    ),
    normalShiftInCount: z.number(),
    normalShiftTotalCount: z.number(),
    normalShiftPercent: z.preprocess(
      (x) => Number(x),
      z.coerce.number({ invalid_type_error: 'should be a number' }),
    ),
  }),
);

export type IAttendanceTable = z.infer<typeof ZAttendanceTable>;

export const ZAttendanceTotal = z
  .array(
    z.object({
      workerInTotal: z.number(),
      workerAllTotal: z.number(),
      workerInPercent: z.preprocess((x) => Number(x), z.coerce.number()),
      totalTeamName: z.string().nullable(),
    }),
  )
  .default([]);

export type IAttendanceTotal = z.infer<typeof ZAttendanceTotal>;
