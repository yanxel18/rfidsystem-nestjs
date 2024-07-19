CREATE VIEW dbo.view_employee_board WITH SCHEMABINDING AS
SELECT
  A.rbe_emp_id AS empID,
  A.rbe_taginfo_id AS tagID,
  FORMAT(A.rbe_lastupdate_date, 'yyyy-MM-dd hh:mm:ss') AS lastUpdate,
  dbo.fn_getElapseTime(
    A.rbe_lastupdate_date,
    A.rbe_rwl_id,
    A.rbe_comment
  ) AS timeElapse,
  B.rfe_displayname AS displayName,
  A.rbe_status_id AS statusID,
  C.rfs_sign AS sign,
  A.rbe_rwl_id AS readwriterID,
  A.rbe_comment AS COMMENT,
  E.rfa_area_id AS areaID,
  E.rfa_area_desc AS areaDesc,
  E.rfa_toalarm AS alarm,
  dbo.fn_checktoalarm(
    A.rbe_lastupdate_date,
    A.rbe_rwl_id,
    A.rbe_comment,
    E.rfa_toalarm
  ) AS setAlarm,
  (
    CASE
      WHEN Datediff(MINUTE, A.rbe_lastupdate_date, Getdate()) >= 60
      AND a.rbe_rwl_id = 95
      AND a.rbe_comment IS NOT NULL THEN CAST(0 AS BIT)
      ELSE CAST(1 AS BIT)
    END
  ) AS setCount,
  F.rfb_rw_id AS locID,
  F.rfb_rwlocation_desc AS locDesc,
  F.rfb_floor AS floor,
  { fn CONCAT(F.rfb_rwlocation_desc, F.rfb_floor) } AS buildloc,
  G.rwp_empprocess_id AS empProcessID,
  G.rwp_process_desc AS processName,
  I.rte_empteam_id AS teamID,
  I.rte_empteam_desc AS teamName,
  A.rbe_leave_start AS leaveStart,
  A.rbe_leave_end AS leaveEnd,
  A.rbe_leave_type AS leaveType,
  B.rfe_emp_rw_id AS emprwID,
  dbo.rf_readwriter_list.rwl_rwlocation_id AS empLoc,
  dbo.rf_readwriter_list.rwl_area_id AS empArea,
  B.rfe_div_id AS divID,
  B.rfe_pos_id AS posID,
  C.rfs_order AS statusOrder,
  J.rfk_kakari_id AS kakariID,
  J.rfk_kakari_desc AS kakariDesc,
  CASE
    WHEN (
      (
        CONVERT(
          FLOAT,
          Datediff(HOUR, H.rfs_datein, GETDATE())
        ) >= 0
        AND CONVERT(FLOAT, Datediff(MINUTE, H.rfs_datein, GETDATE())) >= 0
      )
      AND (
        CONVERT(
          FLOAT,
          Datediff(
            HOUR,
            H.rfs_dateout,
            GETDATE()
          )
        ) < 0
        AND CONVERT(
          FLOAT,
          Datediff(MINUTE, H.rfs_dateout, GETDATE())
        ) < 0
      )
    ) THEN 1
    ELSE 0
  END AS onShift
FROM
  dbo.rf_employee_board AS A
  INNER JOIN dbo.rf_employee_list AS B ON A.rbe_emp_id = B.rfe_emp_id
  INNER JOIN dbo.rf_status AS C ON A.rbe_status_id = C.rf_status_id
  INNER JOIN dbo.rf_readwriter_list AS D ON A.rbe_rwl_id = D.rwl_id
  AND A.rbe_rwl_id = D.rwl_id
  INNER JOIN dbo.rf_area_list AS E ON D.rwl_area_id = E.rfa_area_id
  INNER JOIN dbo.rf_rwlocation_list AS F ON D.rwl_rwlocation_id = F.rfb_rw_id
  INNER JOIN dbo.rf_employee_proclist AS G ON B.rfe_emp_process_id = G.rwp_empprocess_id
  INNER JOIN dbo.rf_employee_teamlist AS I ON B.rfe_emp_team_id = I.rte_empteam_id
  INNER JOIN dbo.rf_employee_shiftlist AS H ON I.rte_empshift_id = H.rfs_empshift_id
  INNER JOIN dbo.rf_readwriter_list ON B.rfe_emp_rw_id = dbo.rf_readwriter_list.rwl_id
  LEFT OUTER JOIN dbo.rf_kakari_list AS J ON B.rfe_kakari_id = J.rfk_kakari_id
WHERE
  (A.rbe_delete = 0)
  AND (B.rfe_deleted = 0)
  AND (B.rfe_active = 1)
  AND (D.rwl_deleted = 0)
  AND (E.rfa_deleted = 0)
  AND (C.rfs_deleted = 0)
  AND (F.rfb_deleted = 0)
  AND (I.rte_deleted = 0)
  AND (G.rwp_deleted = 0)