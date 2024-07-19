SELECT
  TOP (100) PERCENT A.rfe_gid,
  A.rfe_fname,
  A.rfe_lname,
  B.temp_gid,
  B.temp_name,
  B.temp_proc,
  B.temp_bldg,
  B.temp_shift,
  B.temp_div,
  B.temp_pos
FROM
  dbo.rf_employee_list AS A
  LEFT JOIN dbo.rf_temp_employee AS B ON A.rfe_gid = B.temp_gid
WHERE
  (
    A.rfe_lname NOT IN (
      SELECT
        rfe_lname
      FROM
        dbo.rf_employee_list
      WHERE
        (rfe_lname LIKE '%GUEST%')
        OR (rfe_lname LIKE '%営業%')
    )
  )
  AND (A.rfe_deleted = 0)
  AND (A.rfe_active = 1);