SELECT
  ROW_NUMBER() OVER (
    ORDER BY
      [NAME]
  ) AS num_row,
  GID,
  [NAME] AS 'Name',
  [EMAIL] AS 'Email'
FROM
  [jtydb_staff_management].[dbo].[view_em_T_latestEmpInfo]
WHERE
  (TRIM([EMAIL]) <> '');