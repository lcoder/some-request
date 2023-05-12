publish:
	@echo '--------------- Start publishing ------------------'
	@pnpm i
	@pnpm install npm-platform-publish -w
	@git checkout .
	@npx npp publish --taskId $(shell echo $$HARDWORKER_TASK_ID)
	@echo '--------------- Publish successfully --------------'
