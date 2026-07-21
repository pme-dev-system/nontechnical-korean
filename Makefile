# nontechnical-korean — Makefile (github harness 生成)
.DEFAULT_GOAL := help
GH := github

.PHONY: help init readme images doctor version release qa

help: ## 利用可能なターゲットを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-10s\033[0m %s\n",$$1,$$2}'

init: ## リポジトリの雛形生成(README/LICENSE/コミュニティ/CHANGELOG)
	$(GH) init . --tier full

readme: ## READMEを再生成
	$(GH) readme .

images: ## /gi 画像プロンプト生成
	$(GH) images . --kind all

doctor: ## リポジトリの健康診断
	$(GH) doctor .

version: ## 次バージョンの算定(conventional commits)
	$(GH) version .

release: ## リリース計画(デフォルトdry-run)
	$(GH) release .

qa: ## 公開前の検証
	$(GH) qa .
