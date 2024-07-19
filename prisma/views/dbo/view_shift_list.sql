SELECT
  a.rwt_date,
  b.rte_empteam_desc,
  c.rfs_empshift_desc,
  a.rwt_workershift_id,
  a.rwt_workerteam_id,
  c.rfs_empshift_id,
  c.rfs_datein,
  c.rfs_dateout
FROM
  dbo.rf_temp_shiftdata AS a
  JOIN dbo.rf_employee_teamlist AS b ON a.rwt_workerteam_id = b.rte_empteam_id
  JOIN dbo.rf_employee_shiftlist AS c ON a.rwt_workershift_id = c.rfs_empshift_id;