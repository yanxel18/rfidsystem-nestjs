CREATE VIEW dbo.view_location_list AS
SELECT
  rfb_rw_id AS locID,
  { fn CONCAT(rfb_rwlocation_desc, rfb_floor) } AS buildloc
FROM
  dbo.rf_rwlocation_list
WHERE
  (rfb_rw_id NOT IN (12))
  AND (rfb_deleted <> 1)