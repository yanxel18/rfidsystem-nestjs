SELECT
  CAST(reld_autolog_date AS smalldatetime) AS DateSelect
FROM
  dbo.rf_employee_logs_detailed
WHERE
  (
    CAST(DATEPART(mi, reld_autolog_date) AS INT) % 30 = 0
  )
GROUP BY
  reld_autolog_date;