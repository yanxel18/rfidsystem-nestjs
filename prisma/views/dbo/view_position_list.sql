SELECT
  rfp_pos_id AS posID,
  rfp_pos_name AS posName
FROM
  dbo.rf_position
WHERE
  (rfp_deleted <> 1);