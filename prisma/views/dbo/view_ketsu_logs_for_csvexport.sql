CREATE VIEW dbo.view_ketsu_logs_for_csvexport AS
SELECT
  alertType AS アラート区分,
  workerShiftDate AS 更新時間,
  processName AS 実工程,
  locName AS 号棟,
  teamName AS 実班,
  shiftName AS 直,
  GID,
  displayName AS 氏名,
  checkerWorkerA AS 第1勤怠確認者,
  checkerWorkerB AS 第2勤怠確認者,
  checkerWorkerC AS 第3勤怠確認者,
  checkerWorkerD AS 第4勤怠確認者,
  checkerWorkerE AS 第5勤怠確認者,
  checkerWorkerF AS 第6勤怠確認者,
  confirmWorker AS [【確認_対応者】],
  NULL AS [【応答_回答者】],
  reasonDesc AS [【内容】],
  contactDesc AS [【連絡有無】],
  shiftID,
  toShow
FROM
  dbo.view_ketsu_logs