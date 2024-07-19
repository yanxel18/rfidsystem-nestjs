CREATE VIEW dbo.view_employee_logs AS
SELECT
  TOP (100) PERCENT dbo.rf_employee_logs.rel_emp_id AS empID,
  dbo.rf_employee_logs.rel_taginfo_id AS tagInfo,
  dbo.rf_employee_logs.rel_datetime AS areaTimestamp,
  dbo.rf_employee_list.rfe_displayname AS displayName,
  dbo.rf_status.rf_status_id AS signID,
  dbo.rf_status.rfs_sign AS sign,
  dbo.rf_area_list.rfa_area_desc AS destinationArea,
  dbo.rf_division.rdv_div_name AS divName,
  rf_area_list_1.rfa_area_desc AS workArea,
  dbo.rf_employee_list.rfe_gid AS gid,
  dbo.rf_employee_teamlist.rte_empteam_desc AS team,
  { fn CONCAT(
    dbo.rf_rwlocation_list.rfb_rwlocation_desc,
    dbo.rf_rwlocation_list.rfb_floor
  ) } AS bldg
FROM
  dbo.rf_employee_logs
  INNER JOIN dbo.rf_employee_list ON dbo.rf_employee_logs.rel_emp_id = dbo.rf_employee_list.rfe_emp_id
  INNER JOIN dbo.rf_status ON dbo.rf_employee_logs.rel_status_id = dbo.rf_status.rf_status_id
  INNER JOIN dbo.rf_readwriter_list ON dbo.rf_employee_logs.rel_rwl_id = dbo.rf_readwriter_list.rwl_id
  INNER JOIN dbo.rf_area_list ON dbo.rf_readwriter_list.rwl_area_id = dbo.rf_area_list.rfa_area_id
  INNER JOIN dbo.rf_division ON dbo.rf_employee_list.rfe_div_id = dbo.rf_division.rdv_div_id
  INNER JOIN dbo.rf_readwriter_list AS rf_readwriter_list_1 ON dbo.rf_employee_list.rfe_emp_rw_id = rf_readwriter_list_1.rwl_id
  INNER JOIN dbo.rf_area_list AS rf_area_list_1 ON rf_readwriter_list_1.rwl_area_id = rf_area_list_1.rfa_area_id
  INNER JOIN dbo.rf_employee_teamlist ON dbo.rf_employee_list.rfe_emp_team_id = dbo.rf_employee_teamlist.rte_empteam_id
  INNER JOIN dbo.rf_rwlocation_list ON dbo.rf_readwriter_list.rwl_rwlocation_id = dbo.rf_rwlocation_list.rfb_rw_id
WHERE
  (dbo.rf_employee_list.rfe_deleted = 0)
ORDER BY
  areaTimestamp DESC