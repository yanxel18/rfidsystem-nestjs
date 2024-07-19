SELECT
  TOP (100) PERCENT rfa_area_id AS areaID,
  rfa_area_desc AS areaDesc,
  rfa_order AS areaOrder
FROM
  dbo.rf_area_list
WHERE
  (rfa_deleted <> 1)
  AND (rfa_tocount = 1)
  AND (rfa_deptarea_flag = 1);