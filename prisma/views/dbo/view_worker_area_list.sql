CREATE VIEW dbo.view_worker_area_list AS
SELECT
  areaID,
  areaDesc,
  locationID,
  bldg
FROM
  (
    SELECT
      b.rwl_id AS areaID,
      a.rfa_area_desc AS areaDesc,
      b.rwl_rwlocation_id AS locationID,
      { fn CONCAT(c.rfb_rwlocation_desc, c.rfb_floor) } AS bldg
    FROM
      dbo.rf_area_list AS a
      INNER JOIN dbo.rf_readwriter_list AS b ON a.rfa_area_id = b.rwl_area_id
      INNER JOIN dbo.rf_rwlocation_list AS c ON b.rwl_rwlocation_id = c.rfb_rw_id
    WHERE
      (a.rfa_deptarea_flag = 1)
      AND (a.rfa_deleted = 0)
      AND (b.rwl_deleted = 0)
      AND (c.rfb_deleted = 0)
  ) AS AreaTable
GROUP BY
  areaID,
  areaDesc,
  bldg,
  locationID