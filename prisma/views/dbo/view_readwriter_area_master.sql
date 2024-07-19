CREATE VIEW dbo.view_readwriter_area_master AS
SELECT
  dbo.rf_area_list.rfa_area_id AS areaID,
  dbo.rf_area_list.rfa_area_desc AS areaName,
  { fn CONCAT(
    dbo.rf_rwlocation_list.rfb_rwlocation_desc,
    dbo.rf_rwlocation_list.rfb_floor
  ) } AS bldg,
  dbo.rf_area_list.rfa_deptarea_flag AS isDept
FROM
  dbo.rf_readwriter_list
  INNER JOIN dbo.rf_area_list ON dbo.rf_readwriter_list.rwl_area_id = dbo.rf_area_list.rfa_area_id
  INNER JOIN dbo.rf_rwlocation_list ON dbo.rf_readwriter_list.rwl_rwlocation_id = dbo.rf_rwlocation_list.rfb_rw_id
WHERE
  (dbo.rf_readwriter_list.rwl_deleted = 0)
  AND (dbo.rf_rwlocation_list.rfb_deleted = 0)
  AND (dbo.rf_area_list.rfa_deleted = 0)