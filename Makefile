.PHONY: test build deploy ci

test:
	npm test

build:
	npm run build

deploy:
	npm run deploy

ci: test build