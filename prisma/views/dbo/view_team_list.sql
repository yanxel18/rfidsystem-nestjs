SELECT
  TOP (100) rte_empteam_id AS teamID,
  rte_empteam_desc AS teamName
FROM
  dbo.rf_employee_teamlist
WHERE
  (rte_deleted <> 1)
ORDER BY
  rte_order;