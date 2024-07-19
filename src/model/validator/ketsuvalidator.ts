import { z } from 'zod';

export const ZKetsuTable = z.array(
  z.object({
    logID: z.string(),
    alertType: z.string().nullable(),
    workerShiftDate: z.string().nullable(),
    processName: z.string().nullable(),
    shiftName: z.string().nullable(),
    GID: z.string().nullable(),
    locName: z.string().nullable(),
    teamName: z.string().nullable(),
    displayName: z.string().nullable(),
    checkerWorkerA: z.string().nullable(),
    checkerWorkerB: z.string().nullable(),
    checkerWorkerC: z.string().nullable(),
    checkerWorkerD: z.string().nullable(),
    checkerWorkerE: z.string().nullable(),
    checkerWorkerF: z.string().nullable(),
    confirmWorker: z.string().nullable(),
    reasonDesc: z.string().nullable(),
    contactDesc: z.string().nullable(),
    confirmWorkerID: z.string().nullable(),
    reasonID: z.number().nullable(),
    iscontactID: z.number().nullable(),
    createdDate: z.string().nullable(),
    toShow: z.boolean().nullable(),
    shiftID: z.number().nullable(),
    empID: z.string().nullable().optional(),
    kakariDesc: z.string().nullable(),
    divName: z.string().nullable().optional(),
    recipient: z.string().nullable().optional(),
    confirm: z.boolean().nullable().optional(),
  }),
);

export const ZKetsuData = z.object({
  absentData: ZKetsuTable,
  absentCount: z.number().nullable(),
});
export type IKetsuData = z.infer<typeof ZKetsuData>;
export type IKetsuTable = z.infer<typeof ZKetsuTable>;

export const ZApproverList = z
  .array(
    z.object({
      approverEmpID: z.string().nullable(),
      displayName: z.string().nullable(),
    }),
  )
  .default([]);

export const ZEmployeeList = z
  .array(
    z.object({
      rfe_emp_id: z.string().nullable(),
      rfe_displayname: z.string().nullable(),
    }),
  )
  .default([]);

export type IApproverList = z.infer<typeof ZApproverList>;
export type IEmployeeList = z.infer<typeof ZEmployeeList>;

export const ZReasonList = z.array(
  z.object({
    reasonID: z.number(),
    reasonDesc: z.string().nullable(),
  }),
);

export const ZIsContactList = z.array(
  z.object({
    contactID: z.number(),
    contactDesc: z.string().nullable(),
  }),
);

export type IReasonList = z.infer<typeof ZReasonList>;
export type IIsContactList = z.infer<typeof ZIsContactList>;
