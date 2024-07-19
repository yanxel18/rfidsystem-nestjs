[![Build Status](http://172.31.13.100:8080/buildStatus/icon?job=rfid-nestjs-pipeline)](http://172.31.13.100:8080/job/rfid-nestjs-pipeline/)
[![Quality Gate Status](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=alert_status&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Security Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=security_rating&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
[![Maintainability Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=sqale_rating&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
[![Reliability Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=reliability_rating&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
[![Vulnerabilities](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=vulnerabilities&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
[![Bugs](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-nestjs-system&metric=bugs&token=sqb_ee89592e4a1d496d99e07ef1577dda2daf293b19)](http://172.21.75.22:9000/dashboard?id=rfid-nestjs-system)
## アイルスシステム「バックエンド」

## システム所有者
ブライアンフェルナンデズ
## ソフトウェアム要件
* 最新のNodeJSをダウンロードする。[NodeJS](https://nodejs.org/en/download/)

### インストールと構成方法
* ステップ 1: ソースコードリポジトリをダウンロードする。 http://172.31.12.207:7080/git/jt0191340/rfidsystem-nestjs.git
* ステップ  2: ZIPファイルでダウンロードする場合は好きなファイルフォルダに抽出する。
* ステップ  3: 解凍するフォルダにCMDターミナルを設定する.
* ステップ  4: システムの依存関係ダウンロードするには**`npm install`**コマンドを実行する。
* ステップ  5: CMDターミナルで**`npm run start:dev`**コマンドを実行する。
*
### 注意点

* **`npm install`** を実行した後、ソース コードには **`prisma`** パッケージが必要です。
* 最初はCMDでWindows環境のプロクシを設定する
* ステップ 1: set HTTP_PROXY=http:// [global id]:<password>@10.10.10.10:8080
* ステップ 2: set HTTPS_PROXY=http:// [global id]:<password>@10.10.10.10:8080
* ステップ 3: npm install @prisma/client@dev prisma@dev
* ステップ 4: prisma generate
* ステップ 5: npm run start:dev

プロジェクトは[NestJS](https://docs.nestjs.com). version 15.1.1で生成される。

### 使用技術
* NestJS
* Prisma 
* Typescript/Rxjs
* GraphQL

### ビルド
* システムビルドをするようにCMDターミナルで`npm run build`コマンドを実行する。
* ビルドしたファイルは`dist/`フォルダにある。
