.PHONY: test-all reinstall

TEST_FILES=$(wildcard test/*.js)

test-all:
	@for FILE in $(TEST_FILES); do node $$FILE || exit ; done

reinstall:
	npm uninstall reut
	npm cache clean reut
	npm install .
