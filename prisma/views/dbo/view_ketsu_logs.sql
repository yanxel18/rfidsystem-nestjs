CREATE VIEW view_ketsu_logs AS
SELECT
  A.rkd_ketsu_logs_id AS logID,
  F.rtp_alert_desc AS alertType,
  FORMAT(A.rkd_shift_date, 'yyyy-MM-dd HH:mm:ss') AS workerShiftDate,
  B.rwp_process_desc AS processName,
  E.rfs_empshift_desc AS shiftName,
  dbo.fn_getGID(A.rkd_emp_id) AS GID,
  { fn CONCAT(C.rfb_rwlocation_desc, C.rfb_floor) } AS locName,
  D.rte_empteam_desc AS teamName,
  dbo.fn_getDisplayNameByEmpID(A.rkd_emp_id) AS displayName,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_a) AS checkerWorkerA,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_b) AS checkerWorkerB,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_c) AS checkerWorkerC,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_d) AS checkerWorkerD,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_e) AS checkerWorkerE,
  dbo.fn_getDisplayNameByEmpID(A.rkd_confirm_emp_id_f) AS checkerWorkerF,
  dbo.fn_getDisplayNameByEmpID(A.rkd_checker_emp_id) AS confirmWorker,
  G.rs_reason_desc AS reasonDesc,
  H.rcd_contact_desc AS contactDesc,
  A.rkd_checker_emp_id AS confirmWorkerID,
  A.rkd_reason_id AS reasonID,
  A.rkd_contact_id AS iscontactID,
  FORMAT(A.rkd_created_date, 'yyyy-MM-dd') AS createdDate,
  A.rkd_toshow AS toShow,
  E.rfs_empshift_id AS shiftID,
  A.rkd_emp_id AS empID,
  J.rdv_div_name AS divName,
  L.rfk_kakari_desc AS kakariDesc,
  CONCAT(
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_a),
    ',',
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_b),
    ',',
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_c),
    ',',
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_d),
    ',',
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_e),
    ',',
    dbo.fn_getEmailByGID(A.rkd_confirm_emp_id_f)
  ) AS recipient,
  A.rkd_confirm AS 'confirm'
FROM
  dbo.rf_ketsu_logs AS A
  INNER JOIN dbo.rf_employee_proclist AS B ON A.rkd_process_id = B.rwp_empprocess_id
  INNER JOIN dbo.rf_rwlocation_list AS C ON A.rkd_rwlocation_id = C.rfb_rw_id
  INNER JOIN dbo.rf_employee_teamlist AS D ON A.rkd_empteam_id = D.rte_empteam_id
  INNER JOIN dbo.rf_employee_shiftlist AS E ON A.rkd_empshift_id = E.rfs_empshift_id
  INNER JOIN dbo.rf_ketsu_alert_type_list AS F ON A.rkd_alert_type_id = F.rtp_alert_type_id
  INNER JOIN dbo.rf_employee_list AS K ON A.rkd_emp_id = K.rfe_emp_id
  INNER JOIN dbo.rf_division AS J ON K.rfe_div_id = J.rdv_div_id
  INNER JOIN dbo.rf_kakari_list AS L ON K.rfe_kakari_id = L.rfk_kakari_id
  LEFT OUTER JOIN dbo.rf_ketsu_reason_list AS G ON A.rkd_reason_id = G.rs_reason_id
  LEFT OUTER JOIN dbo.rf_ketsu_iscontact_list AS H ON A.rkd_contact_id = H.rcd_contact_id