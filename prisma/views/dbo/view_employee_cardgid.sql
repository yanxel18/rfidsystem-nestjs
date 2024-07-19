CREATE VIEW [dbo].[view_employee_cardgid] WITH SCHEMABINDING AS
SELECT
  CASE
    WHEN (rfe_gid = rfe_gid_card) THEN rfe_gid
    ELSE rfe_gid_card
  END AS rfe_gid,
  rfe_emp_id,
  rfe_deleted,
  rfe_active,
  rfe_emp_team_id
FROM
  dbo.rf_employee_list