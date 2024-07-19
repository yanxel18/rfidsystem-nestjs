SELECT
  dbo.rf_readwriter_list.rwl_id,
  dbo.rf_readwriter_list.rwl_rw_id,
  dbo.rf_readwriter_list.rwl_ant_id,
  dbo.rf_readwriter_list.rwl_rwlocation_id,
  dbo.rf_readwriter_list.rwl_area_id,
  dbo.rf_area_list.rfa_area_desc
FROM
  dbo.rf_readwriter_list
  JOIN dbo.rf_area_list ON dbo.rf_readwriter_list.rwl_area_id = dbo.rf_area_list.rfa_area_id;